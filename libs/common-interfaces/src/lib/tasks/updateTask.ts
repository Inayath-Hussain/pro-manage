import { IAddTaskBody } from "./addTask";
import { ITaskJSON } from "./model";

export interface IUpdateTaskBody extends IAddTaskBody {
    taskId: string
}

type IUpdateTaskBodyError = {
    message: string
    errors: {
        [p in keyof Partial<IUpdateTaskBody>]: string
    }
}


export class UpdateTaskMiddlewareError implements IUpdateTaskBodyError {

    errors: IUpdateTaskBodyError["errors"];
    message: string;

    constructor(message: string, errors: IUpdateTaskBodyError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }

    addFieldError(key: keyof IUpdateTaskBodyError["errors"], message: string) {
        this.errors[key] = message
    }

}




export class InvalidTaskId {
    message: string;
    invalidTaskId: boolean;

    constructor() {
        this.message = "Task doesn't exist"
        this.invalidTaskId = true
    }
}






export class UpdateTaskResponse {
    message: string;
    task: ITaskJSON;

    constructor(message: string, task: ITaskJSON) {
        this.message = message;
        this.task = task
    }
}