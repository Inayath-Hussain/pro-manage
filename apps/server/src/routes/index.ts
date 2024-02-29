// this is the main router file where all the routers are added to express app.

import { Router } from "express"
import { userRouter } from "./user";
import { taskRouter } from "./task";

const router = Router();


router.use("/user", userRouter)
router.use("/task", taskRouter)

export { router as mainRouter }