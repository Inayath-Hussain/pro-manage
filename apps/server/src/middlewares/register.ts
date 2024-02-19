import { body, checkExact } from "express-validator";
import { IValidateRequestMiddlewares } from "./interface";
import { checkForErrors } from "../utilities/requestHandlers/checkForErrors";

export const validateRegisterBody: IValidateRequestMiddlewares = [
    body("name").trim().escape()
        .exists({ values: "falsy" }).withMessage("name is required")
        .not().isNumeric().withMessage("name should contain letters"),

    body("email").trim().escape()
        .exists({ values: "falsy" }).withMessage("email is required")
        .isEmail().withMessage("email is invalid"),

    body("password").trim().escape()
        .exists({ values: "falsy" }).withMessage("password field is undefined, null or missing")
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).
        withMessage("password should be 8 letters long and contain atleast one number, one Uppercase letter and one special symbol"),

    checkExact(undefined, { message: "Invalid body. should contain only name, email and password.", locations: ["body"] }),

    checkForErrors
]