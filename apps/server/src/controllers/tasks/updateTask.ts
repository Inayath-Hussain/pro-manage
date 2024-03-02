import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { IUpdateTaskBody, InvalidTaskId } from "@pro-manage/common-interfaces";
import { taskService } from "../../services/task";


export const updateTaskController: RequestHandler<{}, {}, IUpdateTaskBody> = async (req, res, next) => {
    const email = req.email as string
    const { body } = req

    const userDoc = await userService.getUserByEmail(email)

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "email doesn't exist" } as Ierror)
    }


    const taskDoc = await taskService.getTasksByID(userDoc._id, body.taskId)

    if (taskDoc === null) {
        const invalidTaskIdObj = new InvalidTaskId();
        return res.status(404).json(invalidTaskIdObj)
    }

    await taskService.updateTask(taskDoc, body)

    return res.status(200).json({ message: "success" });
}