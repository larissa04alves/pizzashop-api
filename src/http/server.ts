import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello World 🌍");

app.listen(3333, () => {
    console.log("Server running ⚡");
});
