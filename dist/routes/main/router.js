import express from "express";
import { getLobby } from "../../controllers/main/controller.js";
const router = express.Router();
router.get("/", getLobby);
export default router;
//# sourceMappingURL=router.js.map