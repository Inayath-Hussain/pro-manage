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