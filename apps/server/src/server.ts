import { app } from "./app";
import { connectToMongoDB } from "./config/db";
import { env } from "./config/env";

// get db connect


async function main() {

    // only after successfully connecting to mongodb, express server is started
    connectToMongoDB().then(() => {

        app.listen(env.PORT, () => {
            console.log("server listening on port", env.PORT)
        })

    })
}


main()