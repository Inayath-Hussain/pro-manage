import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { taskService } from "../../services/task";
import { InvalidTaskId } from "@pro-manage/common-interfaces";

export const deleteTaskController: RequestHandler = async (req, res, next) => {
    const email = req.email as string;
    const { id } = req.params

    const userDoc = await userService.getUserByEmail(email);

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "email doesn't exist" } as Ierror)
    }

    const task = await taskService.getTasksByID(userDoc._id, id)

    if (task === null) {
        const invalidTaskIdObj = new InvalidTaskId();
        return res.status(404).json(invalidTaskIdObj)
    }

    await task.deleteOne()

    return res.status(200).json({ message: "success" })
}