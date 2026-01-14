import { getInitialUser } from "@/hooks/user";
import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://bills.stelan.io";

const user = getInitialUser();
const userId = user?.id || "";

export const socket = io(URL, {
    auth: {
        "x-user-id": userId,
    },
});
