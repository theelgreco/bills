import express from "express";
import "dotenv/config";
import { authenticate } from "./shared/middleware/user";
import { handleAppErrors } from "./shared/middleware/errors";
import { login, register } from "./features/auth/controllers";
import { getFamily, postFamilies, postFamilyJoin } from "./features/families/controllers";
import { hasFamily } from "./features/families/permissions";

const PORT = Number(process.env.PORT || 8080);

const app = express();

app.use(express.json());

/** Auth */
app.post("/register", register);
app.post("/login", login);

// Auth middleware
app.use(authenticate);

/** Families */
app.get("/families/:id", hasFamily, getFamily);
app.post("/families", postFamilies);
app.post("/families/:id/join", postFamilyJoin);

/** Bills */


app.use(handleAppErrors);

app.listen(PORT, () => {
    console.log(`Listening at: http://localhost:${PORT}`);
});
