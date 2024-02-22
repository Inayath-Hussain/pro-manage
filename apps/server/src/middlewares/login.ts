import { body, checkExact } from 'express-validator';
import { checkForErrors } from '../utilities/requestHandlers/checkForErrors';
import { IValidateRequestMiddlewares } from './interface';


export const validateLoginBody: IValidateRequestMiddlewares = [
    body("email").trim().escape()
        .exists({ values: "falsy" }).withMessage("email is required").bail()
        .isEmail().withMessage("Invalid email"),

    body("password").trim().escape()
        .exists({ values: "falsy" }).withMessage("password is required").bail()
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage("password should be 8 letters long and contain atleast one number, one Uppercase letter and one special symbol"),

    checkExact(undefined, { message: "Invalid body. should contain only email and password.", locations: ["body"] }),

    checkForErrors
]