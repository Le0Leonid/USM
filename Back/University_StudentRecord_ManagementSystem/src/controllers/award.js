// 奖惩管理控制
import { poolPromise } from "../db.js";

// 获取所有奖惩记录
export async function getAllAwards(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT RAP.*, STUDENT.NAME as STUDENT_NAME
            FROM RAP
            JOIN STUDENT ON RAP.STUID = STUDENT.ID
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 获取单个奖惩记录
export async function getAwardById(req, res) {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("LOGS", id)
            .query(`
                SELECT RAP.*, STUDENT.NAME as STUDENT_NAME
                FROM RAP
                JOIN STUDENT ON RAP.STUID = STUDENT.ID
                WHERE RAP.LOGS = @LOGS
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "未找到相关奖惩记录" });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 获取单个学生的奖惩记录
export async function getStudentAwards(req, res) {
    const { studentId } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("STUID", studentId)
            .query(`
                SELECT RAP.*, STUDENT.NAME as STUDENT_NAME
                FROM RAP
                JOIN STUDENT ON RAP.STUID = STUDENT.ID
                WHERE RAP.STUID = @STUID
                ORDER BY RAP.TIMES DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 添加奖惩记录
export async function addAward(req, res) {
    const { STUID, TYPE, MEMO, TIMES } = req.body;
    try {
        // 验证必填字段
        if (!STUID || !TYPE || !MEMO) {
            return res.status(400).json({ message: "学生ID、类型和说明为必填项" });
        }
        
        const pool = await poolPromise;
        
        // 检查学生是否存在
        const studentCheck = await pool.request()
            .input("STUID", STUID)
            .query("SELECT COUNT(*) as count FROM STUDENT WHERE ID = @STUID");
            
        if (studentCheck.recordset[0].count === 0) {
            return res.status(404).json({ message: "未找到该学生" });
        }
        
        // 添加奖惩记录
        const result = await pool.request()
            .input("STUID", STUID)
            .input("TYPE", TYPE)
            .input("MEMO", MEMO)
            .input("TIMES", TIMES || new Date())
            .query(`
                INSERT INTO RAP (STUID, TYPE, MEMO, TIMES)
                VALUES (@STUID, @TYPE, @MEMO, @TIMES);
                
                SELECT SCOPE_IDENTITY() AS id;
            `);
            
        const newId = result.recordset[0].id;
        res.status(201).json({ 
            message: "奖惩记录添加成功", 
            id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 更新奖惩记录
export async function updateAward(req, res) {
    const { id } = req.params;
    const { TYPE, MEMO, TIMES } = req.body;
    
    try {
        // 验证有效字段
        if (!TYPE && !MEMO && !TIMES) {
            return res.status(400).json({ message: "请提供至少一个要更新的字段" });
        }
        
        const pool = await poolPromise;
        
        // 检查记录是否存在
        const checkResult = await pool.request()
            .input("LOGS", id)
            .query("SELECT COUNT(*) as count FROM RAP WHERE LOGS = @LOGS");
            
        if (checkResult.recordset[0].count === 0) {
            return res.status(404).json({ message: "未找到该奖惩记录" });
        }
        
        // 构建更新查询
        let updateQuery = "UPDATE RAP SET ";
        const updateFields = [];
        const request = pool.request().input("LOGS", id);
        
        if (TYPE) {
            updateFields.push("TYPE = @TYPE");
            request.input("TYPE", TYPE);
        }
        
        if (MEMO) {
            updateFields.push("MEMO = @MEMO");
            request.input("MEMO", MEMO);
        }
        
        if (TIMES) {
            updateFields.push("TIMES = @TIMES");
            request.input("TIMES", TIMES);
        }
        
        updateQuery += updateFields.join(", ") + " WHERE LOGS = @LOGS";
        
        await request.query(updateQuery);
        
        res.json({ message: "奖惩记录更新成功" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 删除奖惩记录
export async function deleteAward(req, res) {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        
        // 检查记录是否存在
        const checkResult = await pool.request()
            .input("LOGS", id)
            .query("SELECT COUNT(*) as count FROM RAP WHERE LOGS = @LOGS");
            
        if (checkResult.recordset[0].count === 0) {
            return res.status(404).json({ message: "未找到该奖惩记录" });
        }
        
        // 删除记录
        await pool.request()
            .input("LOGS", id)
            .query("DELETE FROM RAP WHERE LOGS = @LOGS");
            
        res.json({ message: "奖惩记录删除成功" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}