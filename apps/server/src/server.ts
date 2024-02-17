import { app } from "./app";
import { env } from "./config/env";

// get db connect


async function main() {
    app.listen(env.PORT, () => {
        console.log("server listening on port", env.PORT)
    })
}


main()