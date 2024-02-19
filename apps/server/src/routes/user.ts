import { Router } from "express";
import { validateLoginBody } from "../middlewares/login";
import { loginController } from "../controllers/login";
import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";

const router = Router();

router.post("/login", validateLoginBody);    // middleware
router.post("/login", tryCatchWrapper(loginController));    // controller


export { router as userRouter }