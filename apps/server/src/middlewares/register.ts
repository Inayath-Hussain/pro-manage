import { body, checkExact } from "express-validator";
import { IValidateRequestMiddlewares } from "./interface";
import { checkForErrors } from "../utilities/requestHandlers/checkForErrors";

export const validateRegisterBody: IValidateRequestMiddlewares = [
    body("name").trim().escape()
        .exists({ values: "falsy" }).withMessage("name is required").bail()
        .not().isNumeric().withMessage("name should contain letters"),

    body("email").trim().escape()
        .exists({ values: "falsy" }).withMessage("email is required").bail()
        .isEmail().withMessage("email is invalid"),

    body("password").trim().escape()
        .exists({ values: "falsy" }).withMessage("password is required").bail()
        .isLength({ min: 8 }).withMessage("password must be 8 letters long").bail()
        .isStrongPassword({ minNumbers: 1, minSymbols: 1, minLowercase: 1 })
        .withMessage("must contain atleast 1 number, 1 letter and 1 special symbol"),



    checkExact(undefined, { message: "Invalid body. should contain only name, email and password.", locations: ["body"] }),

    checkForErrors
]