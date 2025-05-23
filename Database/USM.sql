IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'USM')
BEGIN
    CREATE DATABASE USM
END
GO

USE USM
GO

-- 删除表
IF OBJECT_ID('GRADE', 'U') IS NOT NULL
    DROP TABLE GRADE;
IF OBJECT_ID('RAP', 'U') IS NOT NULL
    DROP TABLE RAP;
IF OBJECT_ID('STUDENT', 'U') IS NOT NULL
    DROP TABLE STUDENT;
IF OBJECT_ID('COURSE', 'U') IS NOT NULL
    DROP TABLE COURSE;

CREATE TABLE STUDENT(   -- 学生
    ID SMALLINT PRIMARY KEY,
    NAME NVARCHAR(10) NOT NULL,
    SEX CHAR(2) DEFAULT '男' CHECK(SEX IN('男', '女')),
    BIRTH DATE NOT NULL,
    CLASS NVARCHAR(20) NOT NULL,
    SDEPT NVARCHAR(20) NOT NULL,
    MAJOR NVARCHAR(20) NOT NULL
)

CREATE TABLE COURSE(   -- 课程
    ID CHAR(10) PRIMARY KEY,
    NAME NVARCHAR(20) NOT NULL,
    CREDIT TINYINT CHECK(CREDIT > 0) NOT NULL,
    TEACHER NVARCHAR(20) NOT NULL
)

CREATE TABLE GRADE(   -- 成绩
    LOGS SMALLINT IDENTITY(1, 1) PRIMARY KEY,
    STUID SMALLINT NOT NULL,
    CID CHAR(10) NOT NULL,
    SCORE SMALLINT CHECK(SCORE BETWEEN 0 AND 100),
    FOREIGN KEY (STUID) REFERENCES STUDENT(ID),
    FOREIGN KEY (CID) REFERENCES COURSE(ID)
)

CREATE TABLE RAP(   -- 奖惩
    LOGS SMALLINT IDENTITY(1, 1) PRIMARY KEY,
    STUID SMALLINT NOT NULL,
    TYPE NVARCHAR(50) NOT NULL,
    MEMO NVARCHAR(200),
    TIMES DATE NOT NULL,
    FOREIGN KEY (STUID) REFERENCES STUDENT(ID)
)
GO

-- 创建索引以优化查询性能
CREATE INDEX IDX_STUDENT_SDEPT ON STUDENT(SDEPT);
CREATE INDEX IDX_STUDENT_MAJOR ON STUDENT(MAJOR);
CREATE INDEX IDX_STUDENT_CLASS ON STUDENT(CLASS);
CREATE INDEX IDX_GRADE_STUID ON GRADE(STUID);
CREATE INDEX IDX_GRADE_CID ON GRADE(CID);
CREATE INDEX IDX_RAP_STUID ON RAP(STUID);
CREATE INDEX IDX_RAP_TYPE ON RAP(TYPE);
GO

-- 测试数据
INSERT INTO STUDENT(ID, NAME, SEX, BIRTH, CLASS, SDEPT, MAJOR)
VALUES 
    (10001, '张三', '男', '2000-01-01', '物联201', '计算机学院', '物联网工程'),
    (10002, '李四', '女', '2001-02-15', '软工202', '计算机学院', '软件工程'),
    (10003, '王五', '男', '2000-07-22', '计科201', '计算机学院', '计算机科学与技术');

INSERT INTO COURSE(ID, NAME, CREDIT, TEACHER)
VALUES
    ('CS001', '数据结构', 4, '刘教授'),
    ('CS002', '数据库原理', 3, '王教授'),
    ('CS003', '操作系统', 4, '李教授');

INSERT INTO GRADE(STUID, CID, SCORE)
VALUES
    (10001, 'CS001', 85),
    (10001, 'CS002', 92),
    (10002, 'CS001', 78),
    (10002, 'CS002', 88),
    (10003, 'CS001', 95),
    (10003, 'CS003', 89);

INSERT INTO RAP(STUID, TYPE, MEMO, TIMES)
VALUES
    (10001, '奖学金', '三等奖学金', '2023-09-01'),
    (10002, '优秀学生', '校优秀学生干部', '2023-10-15'),
    (10003, '比赛获奖', '程序设计大赛一等奖', '2023-11-20');
GO