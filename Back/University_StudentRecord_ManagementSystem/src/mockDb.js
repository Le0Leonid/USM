// 模拟数据库 用于在真实数据库连接失败时提供测试数据
const mockData = {
    STUDENT: [
      { ID: "2023001", NAME: "张三", SEX: "男", BIRTH: "2005-09-01", CLASS: "2023级1班", SDEPT: "计算机学院", MAJOR: "软件工程" },
      { ID: "2023002", NAME: "李四", SEX: "女", BIRTH: "2005-03-15", CLASS: "2023级1班", SDEPT: "计算机学院", MAJOR: "软件工程" },
      { ID: "2023003", NAME: "王五", SEX: "男", BIRTH: "2004-12-10", CLASS: "2023级2班", SDEPT: "计算机学院", MAJOR: "计算机科学" },
      { ID: "2023004", NAME: "赵六", SEX: "女", BIRTH: "2005-05-22", CLASS: "2023级2班", SDEPT: "计算机学院", MAJOR: "计算机科学" },
      { ID: "2023005", NAME: "钱七", SEX: "男", BIRTH: "2004-08-17", CLASS: "2023级3班", SDEPT: "电子工程学院", MAJOR: "电子信息" }
    ],
    
    COURSE: [
      { ID: "C001", NAME: "高等数学", CREDIT: 4.0, TEACHER: "王教授" },
      { ID: "C002", NAME: "数据结构", CREDIT: 3.5, TEACHER: "李教授" },
      { ID: "C003", NAME: "计算机网络", CREDIT: 3.0, TEACHER: "张教授" },
      { ID: "C004", NAME: "操作系统", CREDIT: 4.0, TEACHER: "刘教授" },
      { ID: "C005", NAME: "数据库原理", CREDIT: 3.5, TEACHER: "陈教授" }
    ],
    
    GRADE: [
      { LOGS: 1, STUID: "2023001", CID: "C001", SCORE: 85, STUDENT_NAME: "张三", COURSE_NAME: "高等数学" },
      { LOGS: 2, STUID: "2023001", CID: "C002", SCORE: 92, STUDENT_NAME: "张三", COURSE_NAME: "数据结构" },
      { LOGS: 3, STUID: "2023002", CID: "C001", SCORE: 78, STUDENT_NAME: "李四", COURSE_NAME: "高等数学" },
      { LOGS: 4, STUID: "2023002", CID: "C003", SCORE: 88, STUDENT_NAME: "李四", COURSE_NAME: "计算机网络" },
      { LOGS: 5, STUID: "2023003", CID: "C002", SCORE: 76, STUDENT_NAME: "王五", COURSE_NAME: "数据结构" }
    ],
    
    RAP: [
      { LOGS: 1, STUID: "2023001", TYPE: "奖励", MEMO: "学科竞赛一等奖", TIMES: "2024-03-15", STUDENT_NAME: "张三" },
      { LOGS: 2, STUID: "2023002", TYPE: "奖励", MEMO: "优秀学生干部", TIMES: "2024-02-20", STUDENT_NAME: "李四" },
      { LOGS: 3, STUID: "2023003", TYPE: "处分", MEMO: "考试作弊", TIMES: "2024-01-10", STUDENT_NAME: "王五" }
    ]
  };
  
  // 获取下一个ID
  const getNextId = (table) => {
    if (!mockData[table] || mockData[table].length === 0) return 1;
    const maxId = Math.max(...mockData[table].map(item => 
      typeof item.LOGS === 'number' ? item.LOGS : parseInt(item.LOGS)
    ));
    return maxId + 1;
  };
  
  // 模拟SQL查询函数
  function mockQuery(sql, params = {}) {
    console.log(`执行模拟查询: ${sql}`);
    console.log(`参数:`, params);
    
    // 简单的SQL解析器
    if (sql.includes("SELECT * FROM STUDENT")) {
      return { recordset: mockData.STUDENT };
    }
    
    if (sql.includes("SELECT * FROM COURSE")) {
      return { recordset: mockData.COURSE };
    }
    
    if (sql.includes("SELECT GRADE.*, STUDENT.NAME AS STUDENT_NAME, COURSE.NAME AS COURSE_NAME")) {
      return { recordset: mockData.GRADE };
    }
    
    if (sql.includes("SELECT RAP.*, STUDENT.NAME as STUDENT_NAME")) {
      if (sql.includes("WHERE RAP.LOGS =")) {
        const id = params.LOGS || Object.values(params)[0];
        const record = mockData.RAP.find(item => item.LOGS == id);
        return { recordset: record ? [record] : [] };
      }
      return { recordset: mockData.RAP };
    }
    
    if (sql.includes("INSERT INTO") && sql.includes("STUDENT")) {
      const newStudent = { ID: params.ID, NAME: params.NAME, SEX: params.SEX, 
        BIRTH: params.BIRTH, CLASS: params.CLASS, SDEPT: params.SDEPT, MAJOR: params.MAJOR };
      mockData.STUDENT.push(newStudent);
      return { rowsAffected: [1] };
    }
    
    if (sql.includes("INSERT INTO") && sql.includes("COURSE")) {
      const newCourse = { ID: params.ID, NAME: params.NAME, CREDIT: params.CREDIT, TEACHER: params.TEACHER };
      mockData.COURSE.push(newCourse);
      return { rowsAffected: [1] };
    }
    
    if (sql.includes("INSERT INTO") && sql.includes("GRADE")) {
      const newId = getNextId("GRADE");
      const studentName = mockData.STUDENT.find(s => s.ID === params.STUID)?.NAME || "未知";
      const courseName = mockData.COURSE.find(c => c.ID === params.CID)?.NAME || "未知";
      const newGrade = { 
        LOGS: newId, STUID: params.STUID, CID: params.CID, 
        SCORE: params.SCORE, STUDENT_NAME: studentName, COURSE_NAME: courseName 
      };
      mockData.GRADE.push(newGrade);
      return { rowsAffected: [1] };
    }
    
    if (sql.includes("INSERT INTO") && sql.includes("RAP")) {
      const newId = getNextId("RAP");
      const studentName = mockData.STUDENT.find(s => s.ID === params.STUID)?.NAME || "未知";
      const newRecord = { 
        LOGS: newId, STUID: params.STUID, TYPE: params.TYPE, 
        MEMO: params.MEMO, TIMES: params.TIMES || new Date().toISOString().split('T')[0],
        STUDENT_NAME: studentName
      };
      mockData.RAP.push(newRecord);
      return { rowsAffected: [1] };
    }
    
    // 更复杂的查询可以在这里添加更多条件分支
    
    // 默认返回空结果
    return { recordset: [] };
  }
  
  // 模拟数据库连接池
  const mockPool = {
    request: () => {
      const requestObj = {
        query: async (sql) => mockQuery(sql),
        params: {},
        
        input: function(key, value) {
          this.params[key] = value;
          return requestObj; // 返回自身以支持链式调用
        }
      };
      
      // 重写链式调用的query方法
      const originalQuery = requestObj.query;
      requestObj.query = async function(sql) {
        return originalQuery(sql, this.params);
      };
      
      return requestObj;
    }
  };
  
  export default mockPool;