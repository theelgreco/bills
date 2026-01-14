import { EventsMap } from "socket.io/dist/typed-events";
import { Person } from "../../../generated/prisma/client";

declare module "socket.io" {
    interface Socket {
        user: Person;
    }
    interface RemoteSocket<EmitEvents extends EventsMap, SocketData> {
        user: Person;
    }
}
