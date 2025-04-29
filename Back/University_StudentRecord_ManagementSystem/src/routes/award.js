// 奖惩路由
import { Router } from "express";
const router = Router();
import { 
    getAllAwards,
    getAwardById,
    getStudentAwards,
    addAward,
    updateAward,
    deleteAward
} from "../controllers/award.js";

router.get("/", getAllAwards);
router.get("/:id", getAwardById);
router.get("/student/:studentId", getStudentAwards);
router.post("/", addAward);
router.put("/:id", updateAward);
router.delete("/:id", deleteAward);

export default router;