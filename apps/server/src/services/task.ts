import { IAddTaskBody } from "@pro-manage/common-interfaces";

import { Task } from "../models/task";
import { Types } from "mongoose";

interface IAddTaskPayload extends IAddTaskBody {
    user: Types.ObjectId
}

class TaskService {

    /**
     * add's new document in tasks collection 
     */
    async addTask(payload: IAddTaskPayload) {
        const newDoc = new Task({
            user: payload.user,
            title: payload.title,
            dueDate: payload.dueDate,
            checklist: payload.checkList,
            priority: payload.priority
        })

        return newDoc.save()
    }
}

export const taskService = new TaskService();