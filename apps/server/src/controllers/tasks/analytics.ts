// import { IAnalytics } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { taskService } from "../../services/task";

export const getAnalyticsController: RequestHandler = async (req, res, next) => {
    const email = req.email as string

    const userDoc = await userService.getUserByEmail(email)

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "Email doesn't exist" } as Ierror)
    }

    const result = await taskService.getAnalytics(userDoc._id)

    console.log(result[0])

    const analytics = {
        backlog: result[0].backlog[0].count,
        progress: result[0].progress[0].count,
        todo: result[0].todo[0].count,
        done: result[0].done[0].count,
        high: result[0].high[0].count,
        moderate: result[0].moderate[0].count,
        low: result[0].low[0].count,
        dueDate: result[0].dueDate[0].count
    }

    return res.status(200).json({ message: "success", analytics })
}