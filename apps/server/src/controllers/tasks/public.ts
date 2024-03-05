import { RequestHandler } from "express";
import { taskService } from "../../services/task";
import { InvalidTaskId, convertTaskDocToTaskJson } from "@pro-manage/common-interfaces";

export const publicTaskController: RequestHandler = async (req, res, next) => {
    const { id } = req.params

    const taskDoc = await taskService.getPublicTask(id)

    if (taskDoc === null) {
        const invalidTaskIdObj = new InvalidTaskId();
        return res.status(404).json(invalidTaskIdObj)
    }

    const taskJson = convertTaskDocToTaskJson(taskDoc)

    return res.status(200).json({ message: "success", task: taskJson })
}