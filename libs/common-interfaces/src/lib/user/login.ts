export interface ILoginBody {
    email: string
    password: string
}

export type ILoginMiddlewareError = {
    message: string
    errors: {
        [key in keyof Partial<ILoginBody>]: string
    }
}



export class LoginBodyError implements ILoginMiddlewareError {
    message: string;
    errors: ILoginMiddlewareError["errors"];

    constructor(message: string, errors: LoginBodyError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }


    addFieldErrors(key: keyof LoginBodyError["errors"], errorMessage: string) {
        this.errors[key] = errorMessage
    }
}


