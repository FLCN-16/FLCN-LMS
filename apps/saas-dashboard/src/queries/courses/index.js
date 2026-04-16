import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const courses = router("courses", {
    categories: {
        list: router.query({
            fetcher: async () => {
                const response = await fetch.get("/v1/courses/categories");
                return response.data;
            },
        }),
        byId: router.query({
            fetcher: async (variables) => {
                const response = await fetch.get(`/v1/courses/categories/${variables.id}`);
                return response.data;
            },
        }),
        add: router.mutation({
            mutationFn: async (variables) => {
                const response = await fetch.post("/v1/courses/categories", variables);
                return response.data;
            },
        }),
        update: router.mutation({
            mutationFn: async (variables) => {
                const response = await fetch.patch(`/v1/courses/categories/${variables.id}`, variables.data);
                return response.data;
            },
        }),
        remove: router.mutation({
            mutationFn: async (variables) => {
                await fetch.delete(`/v1/courses/categories/${variables.id}`);
            },
        }),
    },
    list: router.query({
        fetcher: async () => {
            const response = await fetch.get("/v1/courses");
            return response.data;
        },
    }),
    byId: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/courses/${variables.id}`);
            return response.data;
        },
    }),
    add: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.post("/api/courses", variables);
            return response.data;
        },
    }),
    update: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/courses/${variables.id}`, variables.data);
            return response.data;
        },
    }),
    publish: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.post(`/api/courses/${variables.id}/publish`);
            return response.data;
        },
    }),
    remove: router.mutation({
        mutationFn: async (variables) => {
            await fetch.delete(`/api/courses/${variables.id}`);
        },
    }),
    liveSessions: {
        list: router.query({
            fetcher: async (variables) => {
                const response = await fetch.get("/api/courses/live-sessions", {
                    params: { courseId: variables.courseId },
                });
                return response.data;
            },
        }),
    },
});
export const useCourseCategoriesList = courses.categories.list.useQuery;
export const useCourseCategoryDetail = courses.categories.byId.useQuery;
export const useCreateCourseCategory = courses.categories.add.useMutation;
export const useUpdateCourseCategory = courses.categories.update.useMutation;
export const useDeleteCourseCategory = courses.categories.remove.useMutation;
export const useCoursesList = courses.list.useQuery;
export const useCourseDetail = courses.byId.useQuery;
export const useCreateCourse = courses.add.useMutation;
export const useUpdateCourse = courses.update.useMutation;
export const usePublishCourse = courses.publish.useMutation;
export const useDeleteCourse = courses.remove.useMutation;
export const useCourseLiveSessions = courses.liveSessions.list.useQuery;
