import { body, checkExact } from 'express-validator';
import { checkForErrors } from '../utilities/requestHandlers/checkForErrors';
import { Imiddlewares } from './interface';


export const validateLoginBody: Imiddlewares = [
    body("email").trim().escape()
        .exists({ values: "falsy" }).withMessage("email field is undefined, null or missing")
        .isEmail().withMessage("Invalid email"),

    body("password").trim().escape()
        .exists({ values: "falsy" }).withMessage("password field is undefined, null or missing")
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage("password should contain atleast one number, one letter and one special symbol"),

    checkExact(undefined, { message: "Invalid body. should contain only email and password.", locations: ["body"] }),

    checkForErrors
]