import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { taskService } from "../../services/task";
import { IGetTaskQuery } from "@pro-manage/common-interfaces";

export const getTaskController: RequestHandler<{}, {}, {}, IGetTaskQuery> = async (req, res, next) => {
    const email = req.email as string
    const { filter } = req.query

    const userDoc = await userService.getUserByEmail(email)

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireAccessTokenCookie(res)

        return next({ statusCode: 401, message: "email doesn't exist" } as Ierror)
    }


    const tasks = await taskService.getTasks({ user: userDoc._id, filter })

    return res.status(200).json(tasks)
}