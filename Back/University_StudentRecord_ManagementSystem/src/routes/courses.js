// 课程路由
import { Router } from "express";
const router = Router();
import { 
    getAllCourses, 
    getCourseById, 
    addCourse, 
    updateCourse, 
    deleteCourse,
    searchCourses,
    importCourses
} from "../controllers/courses.js";

router.get("/", getAllCourses);
router.get("/search", searchCourses);
router.get("/:id", getCourseById);
router.post("/", addCourse);
router.post("/import", importCourses);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;