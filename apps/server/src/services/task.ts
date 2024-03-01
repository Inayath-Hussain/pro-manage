import { IAddTaskBody, IGetTaskQuery } from "@pro-manage/common-interfaces";

import { ITask, Task } from "../models/task";
import { Types, FilterQuery } from "mongoose";

interface IAddTaskPayload extends IAddTaskBody {
    user: Types.ObjectId
}

interface IGetTasks {
    user: Types.ObjectId,
    filter?: IGetTaskQuery["filter"] | undefined
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

    /**
     * returns all tasks of a user from db.
     * 
     * if filter is provided then only the tasks satisfying the filter will be returned.
     */
    async getTasks({ user, filter = undefined }: IGetTasks) {
        const query: FilterQuery<ITask> = {}
        query.user = user

        // if filter query is provided
        if (filter) {

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
            query.createdAt = { $gt: date }
        }

        return await Task.find(query).select({ user: 0, __v: 0 })
    }


    /**
     * returns task document containing the provided user and taskID
     * @param user user id
     * @param taskID task id in string format
     */
    async getTasksByID(user: Types.ObjectId, taskID: string) {

        return await Task.findOne({ user, _id: taskID }).select({ user: 0, __v: 0 });
    }
}

export const taskService = new TaskService();