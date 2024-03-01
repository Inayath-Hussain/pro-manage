import { IAddTaskBody } from "./addTask";

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

    constructor(message: string) {
        this.message = message
        this.errors = {}
    }

    addFieldError(key: keyof IUpdateTaskBodyError["errors"], message: string) {
        this.errors[key] = message
    }


}