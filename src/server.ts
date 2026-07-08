import app from "./app";
import { config } from "./config";

const PORT = config.port;

const main = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Error starting the server:", err);
    }
}

main();