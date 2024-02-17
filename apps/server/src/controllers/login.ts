import { RequestHandler } from "express";


export const loginController: RequestHandler = async (req, res, next) => {
    //      
    res.status(200).json({ message: "success" })
}