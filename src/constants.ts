export const API_HOST: string =
    (import.meta.env.VITE_API_HOST as string | undefined) ||
    window.localStorage.getItem("VITE_API_HOST") ||
    "http://localhost:4000";
