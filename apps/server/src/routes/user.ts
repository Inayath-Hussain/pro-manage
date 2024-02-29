import { Router } from "express";
import { loginController } from "../controllers/users/login";
import { validateLoginBody } from "../middlewares/users/login";

import { logoutController } from "../controllers/users/logout";

import { registerController } from "../controllers/users/register";
import { validateRegisterBody } from "../middlewares/users/register";

import { tryCatchWrapper } from "../utilities/requestHandlers/tryCatchWrapper";
import { authMiddleware } from "../middlewares/common/auth";

import { validateUpdateBody } from "../middlewares/users/update";
import { userUpdateController } from "../controllers/users/update";

import { userInfoController } from "../controllers/users/info";

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