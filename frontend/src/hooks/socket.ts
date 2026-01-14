import type { BankCard } from "@/api/schemas";
import { socket } from "@/lib/socket";
import { useEffect } from "react";

interface SocketEvents {
    "members-online": string[];
    "member-online": string;
    "member-offline": string;
    "card-added": BankCard;
    "card-updated": BankCard;
    "card-deleted": string;
}

type SocketEventKeys = keyof SocketEvents;

export type SocketEventCb<T extends SocketEventKeys> = (...args: SocketEvents[T][]) => void;

export function useSocketEvent<T extends SocketEventKeys>(event: T, cb: SocketEventCb<T>) {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on(event, cb as any);
        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.off(event, cb as any);
        };
    }, []);
}

interface SocketEmits {
    "add-card": BankCard;
    "update-card": BankCard;
    "delete-card": string;
}

type SocketEmitKeys = keyof SocketEmits;

export function socketEmit<T extends SocketEmitKeys>(event: T, data: SocketEmits[T]) {
    socket.emit(event, data);
}
