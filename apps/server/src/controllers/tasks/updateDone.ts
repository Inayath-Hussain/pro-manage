import { IUpdateDoneBody, InvalidCheckListItemId, InvalidTaskId } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { taskService } from "../../services/task";

export const updateDoneController: RequestHandler<{}, {}, IUpdateDoneBody> = async (req, res, next) => {
    const email = req.email as string

    const userDoc = await userService.getUserByEmail(email)

    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "email doesn't exist" } as Ierror)
    }


    const { taskId, checkListId } = req.body

    const taskDoc = await taskService.getTasksByID(userDoc._id, taskId)

    if (taskDoc === null) {
        const invalidTaskIdObj = new InvalidTaskId();
        return res.status(404).json(invalidTaskIdObj)
    }


    const index = taskDoc.checklist.findIndex(item => item._id?.toString() === checkListId)
    if (index === -1) {
        const checkListErrorObj = new InvalidCheckListItemId()
        return res.status(404).json(checkListErrorObj)
    }

    await taskService.updateDone(req.body)

    return res.status(200).json({ message: "success" })
}