// this is the main router file where all the routers are added to express app.

import { Router } from "express"
import { userRouter } from "./user";


const router = Router();


router.use("/user", userRouter)


export { router as mainRouter }