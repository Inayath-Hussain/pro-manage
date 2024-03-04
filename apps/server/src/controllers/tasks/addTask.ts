import { AddTaskResponse, IAddTaskBody } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { userService } from "../../services/user";
import { taskService } from "../../services/task";
import { expireAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";

export const addTaskController: RequestHandler<{}, {}, IAddTaskBody> = async (req, res, next) => {
    const email = req.email as string

    const { title, priority, checkList, dueDate } = req.body

    // check if user exists
    const userDoc = await userService.getUserByEmail(email);

    // if user with email(extracted from auth tokens) doesn't exist in db
    if (userDoc === null) {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)
        return next({ statusCode: 401, message: "email doesn't exist" } as Ierror)
    }

    const taskDoc = await taskService.addTask({ user: userDoc._id, title, priority, checkList, dueDate })

    const responseObj = new AddTaskResponse("success", {
        _id: taskDoc._id.toString(),
        title: taskDoc.title, checklist: taskDoc.checklist.toObject(), createdAt: taskDoc.createdAt?.toDateString() as string,
        priority: taskDoc.priority, status: taskDoc.status, dueDate: taskDoc.dueDate?.toDateString()
    })

    return res.status(201).json(responseObj)
}