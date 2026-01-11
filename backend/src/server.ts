import express from "express";
import "dotenv/config";
import { handleAuthorization } from "./shared/middleware/user";
import { handleAppErrors } from "./shared/middleware/errors";

const PORT = Number(process.env.PORT || 8080);

const app = express();

app.use(express.json());
app.use(handleAuthorization);

app.get("/", (req, res) => {
    res.status(200).send({ msg: "OK" });
});

app.use(handleAppErrors);

app.listen(PORT, () => {
    console.log(`Listening at: http://localhost:${PORT}`);
});
