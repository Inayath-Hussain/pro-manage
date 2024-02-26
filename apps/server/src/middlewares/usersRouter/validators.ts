import { isLength, isStrongPassword, isNumeric } from "validator"


export const nameValidator = {
    notNumeric: (value: string) => !isNumeric(value)
}


export const passwordValidator = {
    validLength: (value: string) => isLength(value, { min: 8 }),
    isStrongPassword: (value: string) => isStrongPassword(value, { minNumbers: 1, minSymbols: 1, minLowercase: 1 })
}


export const passwordValidatorErrorMessages = {
    length: "must be 8 letters long",
    StrongPassword: "must contain atleast 1 number, 1 letter and 1 special symbol"
}