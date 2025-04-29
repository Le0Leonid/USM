// 成绩管理控制
import { poolPromise } from "../db.js";

// 获取所有成绩（包含学生姓名和课程名称）
export async function getAllGrades(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT GRADE.*, STUDENT.NAME AS STUDENT_NAME, COURSE.NAME AS COURSE_NAME
            FROM GRADE
            JOIN STUDENT ON GRADE.STUID = STUDENT.ID
            JOIN COURSE ON GRADE.CID = COURSE.ID
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 获取单个成绩记录
export async function getGradeById(req, res) {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("LOGS", id)
            .query(`
                SELECT GRADE.*, STUDENT.NAME AS STUDENT_NAME, COURSE.NAME AS COURSE_NAME
                FROM GRADE
                JOIN STUDENT ON GRADE.STUID = STUDENT.ID
                JOIN COURSE ON GRADE.CID = COURSE.ID
                WHERE GRADE.LOGS = @LOGS
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "未找到该成绩记录" });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 获取单个学生的所有成绩
export async function getStudentGrades(req, res) {
    const { studentId } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("STUID", studentId)
            .query(`
                SELECT GRADE.*, COURSE.NAME AS COURSE_NAME
                FROM GRADE
                JOIN COURSE ON GRADE.CID = COURSE.ID
                WHERE GRADE.STUID = @STUID
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 获取单门课程的所有学生成绩
export async function getCourseGrades(req, res) {
    const { courseId } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("CID", courseId)
            .query(`
                SELECT GRADE.*, STUDENT.NAME AS STUDENT_NAME
                FROM GRADE
                JOIN STUDENT ON GRADE.STUID = STUDENT.ID
                WHERE GRADE.CID = @CID
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 添加成绩记录
export async function addGrade(req, res) {
    const { STUID, CID, SCORE } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("STUID", STUID)
            .input("CID", CID)
            .input("SCORE", SCORE)
            .query(`
                INSERT INTO GRADE (STUID, CID, SCORE)
                VALUES (@STUID, @CID, @SCORE)
            `);
        res.status(201).json({ message: "成绩添加成功" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 更新成绩记录
export async function updateGrade(req, res) {
    const { id } = req.params;
    const { SCORE } = req.body;
    
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("LOGS", id)
            .input("SCORE", SCORE)
            .query(`
                UPDATE GRADE 
                SET SCORE = @SCORE
                WHERE LOGS = @LOGS
            `);
        
        res.json({ message: "成绩更新成功" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 删除成绩记录
export async function deleteGrade(req, res) {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("LOGS", id)
            .query("DELETE FROM GRADE WHERE LOGS = @LOGS");
        res.json({ message: "成绩记录删除成功" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 统计分析 - 获取学生平均分
export async function getStudentAvg(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT STUID, STUDENT.NAME, AVG(SCORE) as AVG_SCORE
            FROM GRADE
            JOIN STUDENT ON GRADE.STUID = STUDENT.ID
            GROUP BY STUID, STUDENT.NAME
            ORDER BY AVG_SCORE DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 统计分析 - 获取课程平均分
export async function getCourseAvg(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT CID, COURSE.NAME, AVG(SCORE) as AVG_SCORE
            FROM GRADE
            JOIN COURSE ON GRADE.CID = COURSE.ID
            GROUP BY CID, COURSE.NAME
            ORDER BY AVG_SCORE DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}