import { ILoginBody } from "@pro-manage/common-interfaces";

import { compare } from "bcrypt"
import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { createAccessToken } from "../../utilities/tokens/accessToken";
import { createRefreshToken } from "../../utilities/tokens/refreshToken";
import { signAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { signRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";

export const loginController: RequestHandler<{}, {}, ILoginBody> = async (req, res, next) => {
    const { email, password } = req.body

    // search if email exits
    const user = await userService.getUserByEmail(email)

    if (user === null) return next({ statusCode: 400, message: "email isn't registered" } as Ierror)

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
        return next({ statusCode: 400, message: "email and password donot match" } as Ierror)
    }

    // creating access and refresh tokens
    const accessToken = await createAccessToken({ email })
    const refreshToken = await createRefreshToken({ email })

    // signing the tokens with a secret key and adding the signed tokens to response cookies
    signAccessTokenCookie(res, accessToken)
    signRefreshTokenCookie(res, refreshToken)

    res.status(200).json({ message: "success" })
}