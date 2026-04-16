import { router } from "react-query-kit"

import fetch from "@/lib/fetch"

export interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  phone?: string
  createdAt: string
}

export const users = router("users", {
  list: router.query({
    fetcher: async (): Promise<User[]> => {
      const response = await fetch.get<User[]>("/api/users")
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<User> => {
      const response = await fetch.get<User>(`/api/users/${variables.id}`)
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: any): Promise<User> => {
      const response = await fetch.post<User>("/api/users", variables)
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: { id: string; data: any }): Promise<User> => {
      const response = await fetch.patch<User>(
        `/api/users/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/users/${variables.id}`)
    },
  }),
})

export const useUsersList = users.list.useQuery
export const useUsers = useUsersList
export const useUserDetail = users.byId.useQuery
export const useCreateUser = users.add.useMutation
export const useUpdateUser = users.update.useMutation
export const useDeleteUser = users.remove.useMutation
