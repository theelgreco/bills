import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
    return name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
}

export async function stringToHexColor(value: string) {
    // Encode the string to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(value);

    // Hash the data using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Extract three segments from the hash value
    const rValue = parseInt(hashHex.substring(0, 8), 16) % 256;
    const gValue = parseInt(hashHex.substring(8, 16), 16) % 256;
    const bValue = parseInt(hashHex.substring(16, 24), 16) % 256;

    const rString = `0${rValue.toString(16)}`.slice(-2);
    const gString = `0${gValue.toString(16)}`.slice(-2);
    const bString = `0${bValue.toString(16)}`.slice(-2);

    return `#${rString}${gString}${bString}`;
}
