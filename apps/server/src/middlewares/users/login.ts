import { body, checkExact } from 'express-validator';
import { checkForErrors } from '../../utilities/requestHandlers/checkForErrors';
import { IValidateRequestMiddlewares } from '../interface';


export const validateLoginBody: IValidateRequestMiddlewares = [
    body("email").trim().escape()
        .exists({ values: "falsy" }).withMessage("email is required").bail()
        .isEmail().withMessage("Invalid email"),

    body("password").trim().escape()
        .exists({ values: "falsy" }).withMessage("password is required"),

    checkExact(undefined, { message: "Invalid body. should contain only email and password.", locations: ["body"] }),

    checkForErrors
]