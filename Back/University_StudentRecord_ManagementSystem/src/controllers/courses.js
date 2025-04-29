// 课程管理控制
import { poolPromise } from "../db.js";
import { asyncHandler, validateRequired } from "../utils/helpers.js";

// 获取所有课程
export const getAllCourses = asyncHandler(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM COURSE");
    res.json(result.recordset);
});

// 获取单个课程
export const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
        .input("ID", id)
        .query("SELECT * FROM COURSE WHERE ID = @ID");
    
    if (result.recordset.length === 0) {
        return res.status(404).json({ message: "未找到该课程" });
    }
    
    res.json(result.recordset[0]);
});

// 添加课程
export const addCourse = asyncHandler(async (req, res) => {
    const { ID, NAME, CREDIT, TEACHER } = req.body;
    
    // 验证必填字段
    const requiredFields = ['ID', 'NAME', 'CREDIT', 'TEACHER'];
    const missingFields = validateRequired(req.body, requiredFields);
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `缺少必填字段: ${missingFields.join(', ')}`
        });
    }
    
    const pool = await poolPromise;
    
    // 检查课程ID是否已存在
    const checkResult = await pool.request()
        .input("ID", ID)
        .query("SELECT COUNT(*) as count FROM COURSE WHERE ID = @ID");
    
    if (checkResult.recordset[0].count > 0) {
        return res.status(409).json({ error: "该课程ID已存在" });
    }
    
    await pool.request()
        .input("ID", ID)
        .input("NAME", NAME)
        .input("CREDIT", CREDIT)
        .input("TEACHER", TEACHER)
        .query(
            `INSERT INTO COURSE (ID, NAME, CREDIT, TEACHER)
            VALUES (@ID, @NAME, @CREDIT, @TEACHER)`
        );
    res.status(201).json({ message: "课程添加成功", id: ID });
});

// 更新课程
export const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { NAME, CREDIT, TEACHER } = req.body;
    
    // 验证必填字段
    const requiredFields = ['NAME', 'CREDIT', 'TEACHER'];
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
        .input("CREDIT", CREDIT)
        .input("TEACHER", TEACHER)
        .query(`
            UPDATE COURSE 
            SET NAME = @NAME, 
                CREDIT = @CREDIT, 
                TEACHER = @TEACHER
            WHERE ID = @ID
        `);
    
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "未找到该课程" });
    }
    
    res.json({ message: "课程信息更新成功" });
});

// 删除课程
export const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await poolPromise;
    
    // 检查是否有关联的成绩数据
    const checkGrades = await pool.request()
        .input("ID", id)
        .query("SELECT COUNT(*) as count FROM GRADE WHERE CID = @ID");
    
    if (checkGrades.recordset[0].count > 0) {
        return res.status(409).json({ 
            error: "该课程有关联的成绩记录，无法删除",
            gradeCount: checkGrades.recordset[0].count 
        });
    }
    
    const result = await pool.request()
        .input("ID", id)
        .query("DELETE FROM COURSE WHERE ID = @ID");
        
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "未找到该课程" });
    }
    
    res.json({ message: "课程删除成功" });
});

// 搜索课程
export const searchCourses = asyncHandler(async (req, res) => {
    const { keyword, teacher, creditMin, creditMax } = req.query;
    const pool = await poolPromise;
    
    let query = `SELECT * FROM COURSE WHERE 1=1`;
    const params = {};
    let paramIndex = 0;
    
    if (keyword) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND (NAME LIKE N'%' + @${paramName} + N'%' OR ID LIKE '%' + @${paramName} + '%')`;
        params[paramName] = keyword;
    }
    
    if (teacher) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND TEACHER LIKE N'%' + @${paramName} + N'%'`;
        params[paramName] = teacher;
    }
    
    if (creditMin) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND CREDIT >= @${paramName}`;
        params[paramName] = parseInt(creditMin, 10);
    }
    
    if (creditMax) {
        paramIndex++;
        const paramName = `p${paramIndex}`;
        query += ` AND CREDIT <= @${paramName}`;
        params[paramName] = parseInt(creditMax, 10);
    }
    
    const request = pool.request();
    // 添加参数
    Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
    });
    
    const result = await request.query(query);
    res.json(result.recordset);
});

// 批量导入课程
export const importCourses = asyncHandler(async (req, res) => {
    const courses = req.body;
    
    if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ error: "请提供有效的课程数据数组" });
    }
    
    const pool = await poolPromise;
    let successCount = 0;
    let failedRecords = [];
    
    // 开启事务
    const transaction = new pool.transaction();
    await transaction.begin();
    
    try {
        for (const course of courses) {
            const { ID, NAME, CREDIT, TEACHER } = course;
            
            try {
                await transaction.request()
                    .input("ID", ID)
                    .input("NAME", NAME)
                    .input("CREDIT", CREDIT)
                    .input("TEACHER", TEACHER)
                    .query(
                        `INSERT INTO COURSE (ID, NAME, CREDIT, TEACHER)
                         VALUES (@ID, @NAME, @CREDIT, @TEACHER)`
                    );
                
                successCount++;
            } catch (error) {
                failedRecords.push({
                    record: course,
                    reason: error.message
                });
            }
        }
        
        await transaction.commit();
        
        res.status(201).json({
            message: `导入完成，成功添加 ${successCount} 门课程`,
            failed: failedRecords
        });
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
});