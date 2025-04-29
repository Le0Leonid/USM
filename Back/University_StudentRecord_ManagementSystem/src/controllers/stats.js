// 统计数据控制器
import { poolPromise } from "../db.js";
import { asyncHandler } from "../utils/helpers.js";

// 获取系统概览统计数据
export const getSystemStats = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    
    // 获取学生总数
    const studentsResult = await pool.request().query("SELECT COUNT(*) as total FROM STUDENT");
    const studentTotal = studentsResult.recordset[0].total;
    
    // 获取课程总数
    const coursesResult = await pool.request().query("SELECT COUNT(*) as total FROM COURSE");
    const courseTotal = coursesResult.recordset[0].total;
    
    // 获取成绩记录总数
    const gradesResult = await pool.request().query("SELECT COUNT(*) as total FROM GRADE");
    const gradeTotal = gradesResult.recordset[0].total;
    
    // 获取奖惩记录总数
    const awardsResult = await pool.request().query("SELECT COUNT(*) as total FROM RAP");
    const awardTotal = awardsResult.recordset[0].total;
    
    // 获取平均成绩
    const avgResult = await pool.request().query("SELECT AVG(SCORE) as average FROM GRADE");
    const avgScore = avgResult.recordset[0].average;
    
    // 获取各分数段人数统计
    const scoreDistribution = await pool.request().query(`
        SELECT 
            COUNT(CASE WHEN SCORE >= 90 THEN 1 END) as excellent,
            COUNT(CASE WHEN SCORE >= 80 AND SCORE < 90 THEN 1 END) as good,
            COUNT(CASE WHEN SCORE >= 70 AND SCORE < 80 THEN 1 END) as average,
            COUNT(CASE WHEN SCORE >= 60 AND SCORE < 70 THEN 1 END) as pass,
            COUNT(CASE WHEN SCORE < 60 THEN 1 END) as fail
        FROM GRADE
    `);

    // 获取性别分布
    const genderDistribution = await pool.request().query(`
        SELECT SEX, COUNT(*) as count
        FROM STUDENT
        GROUP BY SEX
    `);
    
    res.json({
        studentTotal,
        courseTotal,
        gradeTotal,
        awardTotal,
        avgScore,
        scoreDistribution: scoreDistribution.recordset[0],
        genderDistribution: genderDistribution.recordset
    });
});

// 按学院统计学生人数和平均分
export const getStudentsByDepartment = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            s.SDEPT,
            COUNT(DISTINCT s.ID) as studentCount,
            AVG(g.SCORE) as averageScore,
            COUNT(DISTINCT r.LOGS) as awardCount
        FROM STUDENT s
        LEFT JOIN GRADE g ON s.ID = g.STUID
        LEFT JOIN RAP r ON s.ID = r.STUID AND r.TYPE LIKE N'%奖%'
        GROUP BY s.SDEPT
        ORDER BY studentCount DESC
    `);
    
    res.json(result.recordset);
});

// 获取按专业统计的学生人数
export const getStudentsByMajor = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            MAJOR, 
            COUNT(*) as count,
            AVG(DATEDIFF(YEAR, BIRTH, GETDATE())) as averageAge
        FROM STUDENT
        GROUP BY MAJOR
        ORDER BY count DESC
    `);
    
    res.json(result.recordset);
});

// 获取成绩排名前十的学生
export const getTopStudents = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            STUDENT.ID,
            STUDENT.NAME,
            STUDENT.CLASS,
            STUDENT.SDEPT,
            STUDENT.MAJOR,
            AVG(GRADE.SCORE) as averageScore,
            COUNT(GRADE.CID) as courseCount
        FROM STUDENT
        JOIN GRADE ON STUDENT.ID = GRADE.STUID
        GROUP BY STUDENT.ID, STUDENT.NAME, STUDENT.CLASS, STUDENT.SDEPT, STUDENT.MAJOR
        HAVING COUNT(GRADE.CID) >= 2
        ORDER BY averageScore DESC
        OFFSET 0 ROWS
        FETCH NEXT 10 ROWS ONLY
    `);
    
    res.json(result.recordset);
});

// 获取不及格率最高的课程
export const getHighFailRateCourses = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            COURSE.ID,
            COURSE.NAME,
            COURSE.CREDIT,
            COURSE.TEACHER,
            COUNT(*) as totalStudents,
            SUM(CASE WHEN GRADE.SCORE < 60 THEN 1 ELSE 0 END) as failCount,
            CAST(SUM(CASE WHEN GRADE.SCORE < 60 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as DECIMAL(5,2)) as failRate
        FROM COURSE
        JOIN GRADE ON COURSE.ID = GRADE.CID
        GROUP BY COURSE.ID, COURSE.NAME, COURSE.CREDIT, COURSE.TEACHER
        ORDER BY failRate DESC
    `);
    
    res.json(result.recordset);
});

// 获取班级平均成绩统计
export const getClassAvgScores = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            s.CLASS,
            COUNT(DISTINCT s.ID) as studentCount,
            AVG(g.SCORE) as averageScore,
            MAX(g.SCORE) as maxScore,
            MIN(g.SCORE) as minScore
        FROM STUDENT s
        JOIN GRADE g ON s.ID = g.STUID
        GROUP BY s.CLASS
        ORDER BY averageScore DESC
    `);
    
    res.json(result.recordset);
});