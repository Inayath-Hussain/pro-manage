import { body, checkExact } from "express-validator";
import { IValidateRequestMiddlewares } from "../interface";
import { checkForErrors } from "../../utilities/requestHandlers/checkForErrors";
import { nameFieldValidator, passwordFieldValidator } from "./commonValidators";

export const validateRegisterBody: IValidateRequestMiddlewares = [
    nameFieldValidator,

    body("email").trim().escape()
        .exists({ values: "falsy" }).withMessage("email is required").bail()
        .isEmail().withMessage("email is invalid"),

    passwordFieldValidator("password"),


    checkExact(undefined, { message: "Invalid body. should contain only name, email and password.", locations: ["body"] }),

    checkForErrors
]