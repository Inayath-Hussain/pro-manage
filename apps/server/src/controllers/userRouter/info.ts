import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { UserInfo } from "@pro-manage/common-interfaces";

export const userInfoController: RequestHandler = async (req, res, next) => {
    const email = req.email as string

    const userDoc = await userService.getUserByEmail(email)

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireAccessTokenCookie(res)
        return next({ statusCode: 401, message: "Email doesn't exist" } as Ierror)
    }

    const responseData = new UserInfo({ email: userDoc.email, name: userDoc.name })

    return res.status(200).json(responseData)
}