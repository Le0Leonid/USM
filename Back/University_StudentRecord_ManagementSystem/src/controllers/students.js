// 学生管理控制
import { poolPromise } from "../db.js";
import { asyncHandler, validateRequired } from "../utils/helpers.js";

// 获取所有学生
export const getAllStudents = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM STUDENT");
    res.json(result.recordset);
});

// 添加学生
export const addStudent = asyncHandler(async (req, res) => {
    const { ID, NAME, SEX, BIRTH, CLASS, SDEPT, MAJOR } = req.body;
    
    // 验证必填字段
    const requiredFields = ['ID', 'NAME', 'BIRTH', 'CLASS', 'SDEPT', 'MAJOR'];
    const missingFields = validateRequired(req.body, requiredFields);
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `缺少必填字段: ${missingFields.join(', ')}`
        });
    }
    
    const pool = await poolPromise;
    
    // 检查学号是否已存在
    const checkResult = await pool.request()
        .input("ID", ID)
        .query("SELECT COUNT(*) as count FROM STUDENT WHERE ID = @ID");
    
    if (checkResult.recordset[0].count > 0) {
        return res.status(409).json({ error: "该学号已存在" });
    }
    
    await pool.request()
        .input("ID", ID)
        .input("NAME", NAME)
        .input("SEX", SEX || '男')
        .input("BIRTH", BIRTH)
        .input("CLASS", CLASS)
        .input("SDEPT", SDEPT)
        .input("MAJOR", MAJOR)
        .query(
            `INSERT INTO STUDENT (ID, NAME, SEX, BIRTH, CLASS, SDEPT, MAJOR)
             VALUES (@ID, @NAME, @SEX, @BIRTH, @CLASS, @SDEPT, @MAJOR)`
        );
    res.status(201).json({ message: "学生添加成功", id: ID });
});

// 删除学生
export const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await poolPromise;
    
    // 检查是否有关联数据
    const checkGrades = await pool.request()
        .input("ID", id)
        .query("SELECT COUNT(*) as count FROM GRADE WHERE STUID = @ID");
    
    const checkAwards = await pool.request()
        .input("ID", id)
        .query("SELECT COUNT(*) as count FROM RAP WHERE STUID = @ID");
    
    if (checkGrades.recordset[0].count > 0 || checkAwards.recordset[0].count > 0) {
        return res.status(409).json({ 
            error: "该学生有关联的成绩或奖惩记录，无法删除",
            grades: checkGrades.recordset[0].count,
            awards: checkAwards.recordset[0].count
        });
    }
    
    const result = await pool.request()
        .input("ID", id)
        .query("DELETE FROM STUDENT WHERE ID = @ID");
    
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "未找到该学生" });
    }
    
    res.json({ message: "学生删除成功" });
});

// 获取单个学生信息
export const getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
        .input("ID", id)
        .query("SELECT * FROM STUDENT WHERE ID = @ID");
    
    if (result.recordset.length === 0) {
        return res.status(404).json({ message: "未找到该学生" });
    }
    
    res.json(result.recordset[0]);
});

// 更新学生信息
export const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { NAME, SEX, BIRTH, CLASS, SDEPT, MAJOR } = req.body;
    
    // 验证必填字段
    const requiredFields = ['NAME', 'BIRTH', 'CLASS', 'SDEPT', 'MAJOR'];
    const missingFields = validateRequired(req.body, requiredFields);
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `缺少必填字段: ${missingFields.join(', ')}`
        });
    }
    
    const pool = await poolPromise;
    const result = await pool.request()
        .input("ID", id)
        .input("NAME", NAME)
        .input("SEX", SEX)
        .input("BIRTH", BIRTH)
        .input("CLASS", CLASS)
        .input("SDEPT", SDEPT)
        .input("MAJOR", MAJOR)
        .query(`
            UPDATE STUDENT 
            SET NAME = @NAME, 
                SEX = @SEX, 
                BIRTH = @BIRTH, 
                CLASS = @CLASS, 
                SDEPT = @SDEPT, 
                MAJOR = @MAJOR
            WHERE ID = @ID
        `);
    
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "未找到该学生" });
    }
    
    res.json({ message: "学生信息更新成功" });
});

// 批量导入学生
export const importStudents = asyncHandler(async (req, res) => {
    const students = req.body;
    
    if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ error: "请提供有效的学生数据数组" });
    }
    
    const pool = await poolPromise;
    let successCount = 0;
    let failedRecords = [];
    
    // 开启事务
    const transaction = new pool.transaction();
    await transaction.begin();
    
    try {
        for (const student of students) {
            const { ID, NAME, SEX, BIRTH, CLASS, SDEPT, MAJOR } = student;
            
            try {
                await transaction.request()
                    .input("ID", ID)
                    .input("NAME", NAME)
                    .input("SEX", SEX || '男')
                    .input("BIRTH", BIRTH)
                    .input("CLASS", CLASS)
                    .input("SDEPT", SDEPT)
                    .input("MAJOR", MAJOR)
                    .query(
                        `INSERT INTO STUDENT (ID, NAME, SEX, BIRTH, CLASS, SDEPT, MAJOR)
                         VALUES (@ID, @NAME, @SEX, @BIRTH, @CLASS, @SDEPT, @MAJOR)`
                    );
                
                successCount++;
            } catch (error) {
                failedRecords.push({
                    record: student,
                    reason: error.message
                });
            }
        }
        
        await transaction.commit();
        
        res.status(201).json({
            message: `导入完成，成功添加 ${successCount} 条记录`,
            failed: failedRecords
        });
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
});

// 搜索学生
export const searchStudents = asyncHandler(async (req, res) => {
    const { keyword, department, major, className } = req.query;
    const pool = await poolPromise;
    
    let query = `SELECT * FROM STUDENT WHERE 1=1`;
    const params = {};
    let paramIndex = 0;
    
    if (keyword) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND (NAME LIKE N'%' + @${paramName} + N'%' OR CAST(ID AS NVARCHAR) LIKE N'%' + @${paramName} + N'%')`;
        params[paramName] = keyword;
    }
    
    if (department) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND SDEPT = @${paramName}`;
        params[paramName] = department;
    }
    
    if (major) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND MAJOR = @${paramName}`;
        params[paramName] = major;
    }
    
    if (className) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND CLASS = @${paramName}`;
        params[paramName] = className;
    }
    
    const request = pool.request();
    // 添加参数
    Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
    });
    
    const result = await request.query(query);
    res.json(result.recordset);
});

// 获取学生统计数据
export const getStudentStats = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    
    // 获取学院统计
    const deptStats = await pool.request().query(`
        SELECT SDEPT, COUNT(*) as count
        FROM STUDENT
        GROUP BY SDEPT
        ORDER BY count DESC
    `);
    
    // 获取专业统计
    const majorStats = await pool.request().query(`
        SELECT MAJOR, COUNT(*) as count
        FROM STUDENT
        GROUP BY MAJOR
        ORDER BY count DESC
    `);
    
    // 获取班级统计
    const classStats = await pool.request().query(`
        SELECT CLASS, COUNT(*) as count
        FROM STUDENT
        GROUP BY CLASS
        ORDER BY count DESC
    `);
    
    // 获取性别统计
    const genderStats = await pool.request().query(`
        SELECT SEX, COUNT(*) as count
        FROM STUDENT
        GROUP BY SEX
    `);
    
    res.json({
        departments: deptStats.recordset,
        majors: majorStats.recordset,
        classes: classStats.recordset,
        genders: genderStats.recordset
    });
});