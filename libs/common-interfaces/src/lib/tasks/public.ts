interface IPublicTaskParam {
    taskId: string
}

export class PublicTaskMiddlewareError {
    message: string;
    errors: Partial<IPublicTaskParam>;

    constructor(message: string, errors: PublicTaskMiddlewareError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }

    addFieldError(key: keyof PublicTaskMiddlewareError["errors"], message: string) {
        this.errors[key] = message
    }
}