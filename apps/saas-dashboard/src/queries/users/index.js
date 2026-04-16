import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const users = router("users", {
    list: router.query({
        fetcher: async () => {
            const response = await fetch.get("/api/users");
            return response.data;
        },
    }),
    byId: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/users/${variables.id}`);
            return response.data;
        },
    }),
    add: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.post("/api/users", variables);
            return response.data;
        },
    }),
    update: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/users/${variables.id}`, variables.data);
            return response.data;
        },
    }),
    remove: router.mutation({
        mutationFn: async (variables) => {
            await fetch.delete(`/api/users/${variables.id}`);
        },
    }),
});
export const useUsersList = users.list.useQuery;
export const useUsers = useUsersList;
export const useUserDetail = users.byId.useQuery;
export const useCreateUser = users.add.useMutation;
export const useUpdateUser = users.update.useMutation;
export const useDeleteUser = users.remove.useMutation;
