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

export interface ILoginMiddlewareError {
    message: string
    errors: Partial<ILoginBody>
}

export interface IRegisterMiddlewareError {
    message: string
    errors: Partial<IRegisterBody>
}