import type { Request, Response, NextFunction } from "express";
import { InternalServerError, NotFoundError, ResponseError, UnauthorizedError, UniqueError } from "../classes/errors.js";
import { PrismaClientKnownRequestError } from "../../../generated/prisma/internal/prismaNamespace.js";

export function handleAppErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ResponseError) {
        console.error(`${new Date().toISOString()}: ${err.status} | ${err.name} | ${err.message}`);
        res.status(err.status).send(err.response());
        return;
    }

    if (err instanceof PrismaClientKnownRequestError) {
        let prismaError: ResponseError | null = null;

        const { code } = err;
        switch (code) {
            case "P2025":
                prismaError = new NotFoundError(`No ${(err.meta?.modelName as string).toLowerCase()} matching those details`);
                break;
            case "P2002":
                prismaError = new UniqueError(`This ${(err.meta?.modelName as string).toLowerCase()} already exists`);
                break;
        }

        if (prismaError !== null) {
            res.status(prismaError.status).send(prismaError.response());
            return;
        }
    }

    console.error(err);
    res.status(500).send(new InternalServerError().response());
}
