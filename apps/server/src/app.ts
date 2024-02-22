import cors from "cors"
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// config
import { corsOptions } from "./config/corsOptions";
import { env } from "./config/env";
// routers
import { mainRouter } from "./routes";

import { errorHandler } from "./utilities/requestHandlers/errorHandler";

const app = express()



// MIDDLEWARES
app.use(morgan("dev"));   // morgan
app.use(cors(corsOptions))     // cors
app.use(cookieParser(env.COOKIE_PARSER_SECRET))    // cookie-parser
app.use(express.urlencoded({ extended: true }))    // urlencoded
app.use(express.json())    // express.json?


// ROUTES
app.use("/api", mainRouter)     // "/api" prefix


app.use(errorHandler)

export { app }