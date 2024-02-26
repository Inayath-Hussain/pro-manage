import { body } from "express-validator";

/**
 * express-validator for name field in a request's body.
 */
export const nameFieldValidator =
    body("name").trim().escape()
        .exists({ values: "falsy" }).withMessage("name is required").bail()
        .not().isNumeric().withMessage("name should contain letters")


/**
 * express-validator for password field in a request's body.
 */
export const passwordFieldValidator = (fieldName: string) =>
    body(fieldName).trim().escape()
        .exists({ values: "falsy" }).withMessage(`${fieldName} is required`).bail()
        .isLength({ min: 8 }).withMessage(`${fieldName} must be 8 letters long`).bail()
        .isStrongPassword({ minNumbers: 1, minSymbols: 1, minLowercase: 1 })
        .withMessage("must contain atleast 1 number, 1 letter and 1 special symbol")