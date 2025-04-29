// 统计路由
import { Router } from "express";
const router = Router();
import { 
    getSystemStats,
    getStudentsByDepartment,
    getStudentsByMajor,
    getTopStudents,
    getHighFailRateCourses,
    getClassAvgScores
} from "../controllers/stats.js";

router.get("/overview", getSystemStats);
router.get("/students/by-department", getStudentsByDepartment);
router.get("/students/by-major", getStudentsByMajor);
router.get("/students/top", getTopStudents);
router.get("/courses/fail-rate", getHighFailRateCourses);
router.get("/classes/average", getClassAvgScores);

export default router;