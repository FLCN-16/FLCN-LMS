import Cookies from "js-cookie";
import { createQuery } from "react-query-kit";
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import fetch from "@/lib/fetch";
const useSession = createQuery({
    queryKey: ["auth", "session"],
    fetcher: async () => {
        const token = Cookies.get(AUTH_COOKIE_NAME);
        if (!token) {
            return null;
        }
        const response = await fetch.get("/v1/auth/session");
        return response.data;
    },
});
export default useSession;
