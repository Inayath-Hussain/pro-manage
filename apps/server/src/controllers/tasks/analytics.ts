// import { IAnalytics } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { taskService } from "../../services/task";
import { TaskAnalytics } from "@pro-manage/common-interfaces";

export const getAnalyticsController: RequestHandler = async (req, res, next) => {
    const email = req.email as string

    const userDoc = await userService.getUserByEmail(email)

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "Email doesn't exist" } as Ierror)
    }

    const result = await taskService.getAnalytics(userDoc._id)

    const analytics = new TaskAnalytics();
    analytics.addAnalytics(result)

    return res.status(200).json({ message: "success", analytics })
}