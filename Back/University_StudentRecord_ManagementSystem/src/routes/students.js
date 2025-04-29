// 学生路由
import { Router } from "express";
const router = Router();
import { 
    getAllStudents, 
    addStudent, 
    deleteStudent, 
    getStudentById, 
    updateStudent,
    importStudents,
    searchStudents,
    getStudentStats
} from "../controllers/students.js";

router.get("/", getAllStudents);
router.get("/search", searchStudents);
router.get("/stats", getStudentStats);
router.get("/:id", getStudentById);
router.post("/", addStudent);
router.post("/import", importStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;