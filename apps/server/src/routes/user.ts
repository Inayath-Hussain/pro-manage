import { Router } from "express";
import { loginController } from "../controllers/userRouter/login";
import { validateLoginBody } from "../middlewares/usersRouter/login";

import { logoutController } from "../controllers/userRouter/logout";

import { registerController } from "../controllers/userRouter/register";
import { validateRegisterBody } from "../middlewares/usersRouter/register";

import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";
import { authMiddleware } from "../middlewares/common/auth";

import { validateUpdateBody } from "../middlewares/usersRouter/update";
import { userUpdateController } from "../controllers/userRouter/update";

import { userInfoController } from "../controllers/userRouter/info";

const router = Router();

router.post("/login", validateLoginBody);    // middleware
router.post("/login", tryCatchWrapper(loginController));    // controller


router.post("/register", validateRegisterBody);     // middleware
router.post("/register", tryCatchWrapper(registerController))   // controller


router.post("/logout", logoutController)    // controller


router.patch("/update", tryCatchWrapper(authMiddleware), validateUpdateBody)   //middleware
router.patch("/update", userUpdateController)     // controller


router.get("/info", tryCatchWrapper(authMiddleware))
router.get("/info", userInfoController)

export { router as userRouter }