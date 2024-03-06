import { isLength, isStrongPassword, isNumeric, isEmail } from "validator"

interface Valid {
    valid: true
}

interface InValid {
    valid: false
    errorMessage: string
}

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



export const emailValidator = (email: any): Valid | InValid => {
    switch (true) {

        // if email is falsy (undefined, null or empty string)
        case (!email):
            return { valid: false, errorMessage: "email is required" }

        case (typeof email !== "string"):
            return { valid: false, errorMessage: "email should be of type string" }


        case (isEmail(email) === false):
            return { valid: false, errorMessage: "email is invalid" }

        default:
            return { valid: true }
    }
}





export const p = (password: any, fieldName: string = "password"): Valid | InValid => {
    switch (true) {
        // if password is falsy (undefined, null, boolean, empty string)
        case (!password):
            return { valid: false, errorMessage: `${fieldName} is required` }

        case (typeof password !== "string"):
            return { valid: false, errorMessage: `${fieldName} must be of type 'string'` }

        case (isLength(password, { min: 8 }) === false):
            return { valid: false, errorMessage: `${fieldName} must be 8 letters long` }

        case (isStrongPassword(password, { minNumbers: 1, minSymbols: 1, minLowercase: 1 }) === false):
            return { valid: false, errorMessage: "must contain atleast 1 number, 1 letter and 1 special symbol" }

        default:
            return { valid: true }
    }
}