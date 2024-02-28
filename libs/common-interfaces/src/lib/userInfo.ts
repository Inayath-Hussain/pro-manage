interface IuserInfo {
    name: string
    email: string
}

export class UserInfo implements IuserInfo {
    email: string;
    name: string;

    constructor(payload: IuserInfo) {
        this.email = payload.email
        this.name = payload.name
    }
}