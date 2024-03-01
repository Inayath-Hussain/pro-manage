import { Router } from "express";
import { authMiddleware } from "../middlewares/common/auth";
import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";
import { validateAddTaskBody } from "../middlewares/tasks/addTask";
import { addTaskController } from "../controllers/tasks/addTask";
import { getTaskController } from "../controllers/tasks/getTask";
import { validateGetTaskQuery } from "../middlewares/tasks/getTask";

const router = Router();

router.get("/", tryCatchWrapper(authMiddleware), validateGetTaskQuery)    // middleware
router.get("/", getTaskController)      // controller


router.post("/", tryCatchWrapper(authMiddleware), validateAddTaskBody)      //middlewares
router.post("/", addTaskController)     // controller


export { router as taskRouter }