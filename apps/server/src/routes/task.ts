import { Router } from "express";
import { authMiddleware } from "../middlewares/common/auth";
import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";

import { validateAddTaskBody } from "../middlewares/tasks/addTask";
import { addTaskController } from "../controllers/tasks/addTask";

import { getTaskController } from "../controllers/tasks/getTask";
import { validateGetTaskQuery } from "../middlewares/tasks/getTask";

import { deleteTaskController } from "../controllers/tasks/deleteTask";
import { validateDeleteTaskParam } from "../middlewares/tasks/deleteTask";

import { updateTaskController } from "../controllers/tasks/updateTask";
import { validateUpdateTaskBody } from "../middlewares/tasks/updateTask";

const router = Router();

router.get("/", tryCatchWrapper(authMiddleware), validateGetTaskQuery)    // middleware
router.get("/", getTaskController)      // controller


router.post("/", tryCatchWrapper(authMiddleware), validateAddTaskBody)      //middlewares
router.post("/", tryCatchWrapper(addTaskController))     // controller


router.put("/", tryCatchWrapper(authMiddleware), validateUpdateTaskBody)     // middlewares
router.put("/", updateTaskController)    // controller


router.delete("/:id", tryCatchWrapper(authMiddleware), validateDeleteTaskParam)      // middlewares
router.delete("/:id", tryCatchWrapper(deleteTaskController))     // controller

export { router as taskRouter }