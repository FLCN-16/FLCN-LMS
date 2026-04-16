import Cookies from "js-cookie";
import { createMutation } from "react-query-kit";
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import fetch from "@/lib/fetch";
const useLoginUser = createMutation({
    mutationFn: async (variables) => {
        const response = await fetch.post("/v1/auth/login", variables);
        if (response.data.token) {
            const expires = variables.remember ? 30 : undefined;
            Cookies.set(AUTH_COOKIE_NAME, response.data.token, {
                expires,
                sameSite: "lax",
                secure: import.meta.env.PROD,
            });
        }
        return response.data;
    },
});
export default useLoginUser;
