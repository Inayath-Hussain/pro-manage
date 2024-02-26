import { Router } from "express";
import { loginController } from "../controllers/userRouter/login";
import { logoutController } from "../controllers/userRouter/logout";
import { registerController } from "../controllers/userRouter/register";
import { validateLoginBody } from "../middlewares/usersRouter/login";
import { validateRegisterBody } from "../middlewares/usersRouter/register";
import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";
import { authMiddleware } from "../middlewares/common/auth";
import { validateUpdateBody } from "../middlewares/usersRouter/update";
import { userUpdateController } from "../controllers/userRouter/update";

const router = Router();

router.post("/login", validateLoginBody);    // middleware
router.post("/login", tryCatchWrapper(loginController));    // controller


router.post("/register", validateRegisterBody);     // middleware
router.post("/register", tryCatchWrapper(registerController))   // controller


router.post("/logout", logoutController)    // controller


router.patch("/update", authMiddleware, validateUpdateBody)   //middleware
router.patch("/update", userUpdateController)     // controller

export { router as userRouter }