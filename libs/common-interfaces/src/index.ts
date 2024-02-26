export * from './lib/common-interfaces';

export interface ILoginBody {
    email: string
    password: string
}


export interface IRegisterBody {
    name: string
    email: string
    password: string
}


export interface IUpdateBody {
    name?: string
    oldPassword?: string
    newPassword?: string
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


export interface IUpdateMiddlewareError {
    message: string
    errors: Partial<IUpdateBody>
}