interface ICheckList {
    description: string
    done: boolean
}

export interface IAddTaskBody {
    title: string
    priority: string
    dueDate?: string
    checkList: ICheckList[]
}

type IAddTaskBodyError = {
    message: string
    errors: {
        [p in keyof Partial<IAddTaskBody>]: string
    }
}

export class AddTaskMiddlewareError implements IAddTaskBodyError {

    errors: IAddTaskBodyError["errors"];
    message: string;

    constructor(message: string) {
        this.message = message
        this.errors = {}
    }

    addFieldError(key: keyof IAddTaskBodyError["errors"], message: string) {
        this.errors[key] = message
    }


}