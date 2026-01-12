import { Person } from "../../../generated/prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: Person;
        }
    }
}
