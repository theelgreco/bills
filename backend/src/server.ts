import express from "express";
import "dotenv/config";
import { authenticate } from "./shared/middleware/user";
import { handleAppErrors } from "./shared/middleware/errors";
import { login, register } from "./features/auth/controllers";
import { getFamily, postFamilies, postFamilyJoin } from "./features/families/controllers";
import { hasFamily } from "./features/families/permissions";
import { deleteBill, deleteBillPayment, getBills, postBillPayments, postBills, putBill } from "./features/bills/controllers";

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
app.get("/bills", hasFamily, getBills);
app.post("/bills", hasFamily, postBills);
app.put("/bills/:id", hasFamily, putBill);
app.delete("/bills/:id", hasFamily, deleteBill);
app.post("/bills/:id/payments", hasFamily, postBillPayments);
app.delete("/bills/:id/payments/:paymentId", hasFamily, deleteBillPayment);

app.use(handleAppErrors);

app.listen(PORT, () => {
    console.log(`Listening at: http://localhost:${PORT}`);
});
