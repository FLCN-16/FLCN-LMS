import fetch from "@/lib/fetch";
export async function loginUser(email, password, remember) {
    return fetch
        .post("/api/auth/login", { email, password, remember })
        .then((r) => r.data);
}
export async function logoutUser() {
    return fetch.post("/api/auth/logout").then((r) => r.data);
}
