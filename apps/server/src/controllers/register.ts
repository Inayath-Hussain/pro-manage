import { IRegisterBody } from "@pro-manage/common-interfaces";
import { genSalt, hash } from "bcrypt";
import { RequestHandler } from "express";
import { userService } from "../services/user";
import { Ierror } from "../utilities/requestHandlers/errorHandler";
import { createAccessToken } from "../utilities/tokens/accessToken";
import { createRefreshToken } from "../utilities/tokens/refreshToken";
import { signAccessTokenCookie } from "../utilities/cookies/signAccessToken";
import { signRefreshTokenCookie } from "../utilities/cookies/signRefreshToken";

export const registerController: RequestHandler<{}, {}, IRegisterBody> = async (req, res, next) => {
    const { email, name, password } = req.body

    const registeredUser = await userService.getUserByEmail(email)

    if (registeredUser !== null) return next({ statusCode: 400, message: "email is already registered" } as Ierror)

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt)

    await userService.createUser({ email, name, password: hashedPassword })

    const accessToken = await createAccessToken({ email })
    const refreshToken = await createRefreshToken({ email })

    signAccessTokenCookie(res, accessToken)
    signRefreshTokenCookie(res, refreshToken)

    res.status(201).json({ message: "success" })

}