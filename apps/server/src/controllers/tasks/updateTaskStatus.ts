import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { IUpdateTaskStatusBody } from "@pro-manage/common-interfaces";
import { taskService } from "../../services/task";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";


export const updateTaskStatusController: RequestHandler<{}, {}, IUpdateTaskStatusBody> = async (req, res, next) => {
    const email = req.email as string;
    const { status, taskId } = req.body

    const userDoc = await userService.getUserByEmail(email);

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "email doesn't exist" } as Ierror)
    }


    const taskDoc = await taskService.getTasksByID(userDoc._id, taskId);

    if (taskDoc === null) return next({ statusCode: 404, message: "task doesn't exist" } as Ierror)


    await taskService.updateTaskStatus(taskDoc, status)

    return res.status(200).json({ message: "success" })
}