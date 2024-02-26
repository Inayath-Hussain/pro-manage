import { IUpdateBody } from "@pro-manage/common-interfaces";

import { compare } from "bcrypt";
import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";


export const userUpdateController: RequestHandler<{}, {}, IUpdateBody> = async (req, res, next) => {
    // email is added to the request in the auth middleware
    const email = req.email as string

    const { name, newPassword, oldPassword } = req.body

    // get user data from db
    const userDoc = await userService.getUserByEmail(email)

    // if no data exists then send error response
    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "Email doesn't exist" } as Ierror)
    }

    // if oldPassword exists then check if it matches
    if (oldPassword && newPassword) {
        const isPasswordValid = await compare(oldPassword, userDoc?.password)

        if (!isPasswordValid) return next({ statusCode: 400, message: "Incorrect password" } as Ierror)

        const isnewPasswordSame = await compare(newPassword, userDoc.password)

        if (isnewPasswordSame) return next({ statusCode: 400, message: "New Password cannot be same as current." } as Ierror)
    }

    // update user data
    await userService.updateUser(userDoc, name, newPassword)

    return res.status(200).json({ message: "success" })
}