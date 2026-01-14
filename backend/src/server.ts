import express from "express";
import { createServer } from "node:http";
import "dotenv/config";
import cors from "cors";
import { authenticate, authenticateSocket } from "./shared/middleware/user.js";
import { handleAppErrors } from "./shared/middleware/errors.js";
import { login, register } from "./features/auth/controllers.js";
import { getFamily, postFamilies, postFamilyJoin } from "./features/families/controllers.js";
import { hasFamily } from "./features/families/permissions.js";
import { deleteBill, deleteBillPayment, getBills, postBillPayments, postBills, putBill } from "./features/bills/controllers.js";
import { deleteCard, getCards, postCards, putCard } from "./features/cards/controllers.js";
import { Server, Socket } from "socket.io";

const PORT = Number(process.env.PORT || 8080);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(cors());
app.use(express.json());

/** Auth */
app.post("/register", register);
app.post("/login", login);

// Auth middleware
app.use(authenticate);

/** Families */
app.post("/families", postFamilies);
app.get("/families/:id", hasFamily, getFamily);
app.post("/families/:id/join", postFamilyJoin);

/** Bills */
app.get("/bills", hasFamily, getBills);
app.post("/bills", hasFamily, postBills);
app.put("/bills/:id", hasFamily, putBill);
app.delete("/bills/:id", hasFamily, deleteBill);
app.post("/bills/:id/payments", hasFamily, postBillPayments);
app.delete("/bills/:id/payments/:paymentId", hasFamily, deleteBillPayment);

/** Cards */
app.get("/cards", hasFamily, getCards);
app.post("/cards", hasFamily, postCards);
app.put("/cards/:id", hasFamily, putCard);
app.delete("/cards/:id", hasFamily, deleteCard);

app.use(handleAppErrors);

io.use(authenticateSocket);

io.on("connection", async (socket) => {
    const familyRoomName = socket.user.familyId;
    if (familyRoomName) {
        // Alert currently online family members that user connected
        io.to(familyRoomName).emit("member-online", socket.user.id);

        // Join the family room
        socket.join(familyRoomName);

        // Send all online members to the newly connected user
        const onlineMembers = (await io.in(familyRoomName).fetchSockets()).map((sock) => sock.user.id);
        socket.emit("members-online", onlineMembers);

        socket.on("add-card", (data) => socket.to(familyRoomName).emit("card-added", data));
        socket.on("update-card", (data) => socket.to(familyRoomName).emit("card-updated", data));
        socket.on("delete-card", (data) => socket.to(familyRoomName).emit("card-deleted", data));
    }

    socket.on("disconnect", () => {
        if (familyRoomName) {
            // Leave family room on disconnect
            socket.leave(familyRoomName);

            // Alert currently online family members that user disconnected
            io.to(familyRoomName).emit("member-offline", socket.user.id);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Listening at: http://localhost:${PORT}`);
});
