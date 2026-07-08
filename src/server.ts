import app from "./app";

function main(){
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

main();