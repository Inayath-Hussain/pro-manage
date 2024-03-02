export * from './lib/common-interfaces';
export * from "./lib/userUpdate";
export * from "./lib/userInfo";

export * from "./lib/tasks/addTask";
export * from "./lib/tasks/getTask";
export * from "./lib/tasks/updateTask";
export * from "./lib/tasks/updateTaskStatus";
export * from "./lib/tasks/updateDone"

export * from "./lib/tasks/model"

export interface ILoginBody {
    email: string
    password: string
}


export interface IRegisterBody {
    name: string
    email: string
    password: string
}

interface IUnknownField {
    unknownField: string
}

export interface ILoginMiddlewareError {
    message: string
    errors: Partial<ILoginBody & IUnknownField>
}

export interface IRegisterMiddlewareError {
    message: string
    errors: Partial<IRegisterBody & IUnknownField>
}
