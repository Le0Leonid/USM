// 成绩路由
import { Router } from "express";
const router = Router();
import { 
    getAllGrades,
    getGradeById,
    getStudentGrades,
    getCourseGrades,
    addGrade,
    updateGrade,
    deleteGrade,
    getStudentAvg,
    getCourseAvg
} from "../controllers/grades.js";

router.get("/", getAllGrades);
router.get("/record/:id", getGradeById);
router.get("/student/:studentId", getStudentGrades);
router.get("/course/:courseId", getCourseGrades);
router.get("/stats/student-avg", getStudentAvg);
router.get("/stats/course-avg", getCourseAvg);
router.post("/", addGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);

export default router;