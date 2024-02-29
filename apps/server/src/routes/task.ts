import { Router } from "express";
import { authMiddleware } from "../middlewares/common/auth";
import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";
import { validateAddTaskBody } from "../middlewares/tasks/addTask";
import { addTaskController } from "../controllers/tasks/addTask";

const router = Router();

router.post("/", tryCatchWrapper(authMiddleware), validateAddTaskBody)      //middlewares
router.post("/", addTaskController)     // controller


export { router as taskRouter }