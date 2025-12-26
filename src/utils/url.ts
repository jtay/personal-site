/**
 * Generates a full absolute URL using the configured base URL.
 * Uses the URL object for correct path joining and validation.
 * @param path - The path to append to the base URL
 * @returns The full absolute URL
 */
export const getAbsoluteUrl = (path: string = ''): string => {
    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    return new URL(path, baseUrl).toString();
};
