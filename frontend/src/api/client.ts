import { getInitialUser } from "@/hooks/user";
import { ResponseError } from "./types";

function getBaseHeaders() {
    const user = getInitialUser();
    const userId = user?.id || "";

    return {
        "x-user-id": userId,
        "content-type": "application/json",
    };
}

class APIClient {
    baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "http://localhost:8080";
    baseHeaders = getBaseHeaders();

    async fetch(
        url: string,
        { headers, body, method }: { headers?: Record<string, string>; body?: Record<string, unknown>; method?: RequestInit["method"] }
    ) {
        const init: RequestInit = {
            headers: { ...this.baseHeaders, ...headers },
            body: JSON.stringify(body || "{}"),
            method: method || "GET",
        };

        init.headers = { ...this.baseHeaders, ...init.headers };

        const response = await fetch(`${this.baseUrl}${url}`, init);
        const result = response.json ? await response.json() : response;

        if (response.status < 200 || response.status > 299) throw new ResponseError(result as ResponseError);
        else return result;
    }
}

export const apiClient = new APIClient();
