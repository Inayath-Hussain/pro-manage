import { IAddTaskBody, IGetTaskQuery } from "@pro-manage/common-interfaces";

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


    async getTasks(user: Types.ObjectId) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        return await Task.find({ user, createdAt: { $gte: todayStart } }).select({ user: 0, __v: 0 })
    }


    async getTasksWithFilter(user: Types.ObjectId, filter: IGetTaskQuery["filter"]) {

        // today's date and time is set to 12 am
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        switch (filter) {
            case ("day"):
                break;

            case ("week"):
                date.setDate(date.getDate() - 7)
                break;

            case ("month"):
                date.setDate(date.getDate() - 30)
                break;
        }

        return await Task.find({ user, createdAt: { $gt: date } }).select({ user: 0, __v: 0 });
    }
}

export const taskService = new TaskService();