export interface IUpdateBody {
    name?: string
    oldPassword?: string
    newPassword?: string
}


export interface IUpdateMiddlewareError {
    message: string
    errors: Partial<IUpdateBody>
}


export class UserUpdateMiddlewareError implements IUpdateMiddlewareError {
    errors: Partial<IUpdateBody>;
    message: string;

    constructor(message = "Invalid body", errors: IUpdateMiddlewareError["errors"] = {}) {
        this.errors = errors
        this.message = message
    }

    // add any input field errors
    addFieldError = (key: keyof typeof this.errors, errorMsg: string) => {
        this.errors[key] = errorMsg
    }

    addErrorMessage = (message: string) => {
        this.message = message
    }

}