export interface IUpdateDoneBody {
    taskId: string
    checkListId: string
    done: boolean
}

type IUpdateDoneBodyError = {
    message: string
    errors: {
        [p in keyof Partial<IUpdateDoneBody>]: string
    }
}

export class UpdateDoneBodyError implements IUpdateDoneBodyError {
    errors: IUpdateDoneBodyError["errors"];
    message: string;

    /**
     * set's message property and initiates errors with empty object
     * @param message error message
     */
    constructor(message: string) {
        this.message = message
        this.errors = {}
    }

    addFieldError(key: keyof IUpdateDoneBodyError["errors"], message: string) {
        this.errors[key] = message
    }
}


// used to create object when checkList item with provided id doesn't exist 
export class InvalidCheckListItemId {
    message: string;
    invalidCheckListId: boolean;

    constructor() {
        this.message = "CheckList item doesn't exist"
        this.invalidCheckListId = true
    }
}