export interface IUpdateTaskStatusBody {
    taskId: string
    status: string
}

type IUpdateTaskStatusBodyError = {
    message: string
    errors: {
        [p in keyof Partial<IUpdateTaskStatusBody>]: string
    }
}


export class UpdateTaskStatusMiddlewareError implements IUpdateTaskStatusBodyError {

    errors: IUpdateTaskStatusBodyError["errors"];
    message: string;

    constructor(message: string) {
        this.message = message
        this.errors = {}
    }

    addFieldError(key: keyof IUpdateTaskStatusBodyError["errors"], message: string) {
        this.errors[key] = message
    }


}