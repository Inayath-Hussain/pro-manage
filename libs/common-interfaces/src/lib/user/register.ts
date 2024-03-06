export interface IRegisterBody {
    name: string
    email: string
    password: string
}

type IRegisterBodyError = {
    message: string
    errors: {
        [key in keyof Partial<IRegisterBody>]: string
    }
}

export class RegisterBodyError implements IRegisterBodyError {
    message: string;
    errors: IRegisterBodyError["errors"];

    constructor(message: string, errors: RegisterBodyError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }


    addFieldErrors(key: keyof RegisterBodyError["errors"], errorMessage: string) {
        this.errors[key] = errorMessage
    }
}