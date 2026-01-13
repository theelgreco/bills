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

export function capitalise(str: string, allWords = false) {
    if (!allWords) return `${str[0].toUpperCase()}${str.slice(1)}`;

    return str
        .split(" ")
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(" ");
}

export function getOrdinalSuffix(i: number) {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

export function formatSortCode(sortCode: number) {
    const [first, second, third, fourth, fifth, sixth] = sortCode.toString().split("");
    return `${first}${second}-${third}${fourth}-${fifth}${sixth}`;
}
