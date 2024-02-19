import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";

export type IValidateRequestMiddlewares = (ValidationChain | RequestHandler)[]