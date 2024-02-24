import { Router } from "express";
import { loginController } from "../controllers/login";
import { validateLoginBody } from "../middlewares/login";
import { validateRegisterBody } from "../middlewares/register";
import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";
import { registerController } from "../controllers/register";
import { logoutController } from "../controllers/logout";

const router = Router();

router.post("/login", validateLoginBody);    // middleware
router.post("/login", tryCatchWrapper(loginController));    // controller


router.post("/register", validateRegisterBody);     // middleware
router.post("/register", tryCatchWrapper(registerController))   // controller


router.post("/logout", logoutController)    // controller


export { router as userRouter }