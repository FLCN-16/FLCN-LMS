"use client"

import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  IconChevronUp,
  IconLogout,
  IconSettings,
  IconShield,
  IconBell,
  IconUser,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@flcn-lms/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@flcn-lms/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@flcn-lms/ui/components/sidebar"
import useLogout from "@/queries/auth/logout"
import useAuth from "@/features/auth/use-auth.hook"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    role?: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const auth = useAuth()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success("Logged out successfully")
      navigate("/auth/login")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  // Get user initials for avatar fallback
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Role badge display
  const roleDisplay = user.role ? user.role.split("_").join(" ").toUpperCase() : "ADMIN"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-accent/50 hover:bg-accent/30 transition-colors duration-200"
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-amber-400 to-violet-400 text-white font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>

              {/* Chevron */}
              <IconChevronUp className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Dropdown Content */}
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* User Header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex flex-col gap-3 px-2 py-3">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-lg shadow-md">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-amber-400 to-violet-400 text-white font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Role Badge */}
                {user.role && (
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-gradient-to-r from-amber-50 to-violet-50 dark:from-amber-950/30 dark:to-violet-950/30 border border-amber-200/50 dark:border-amber-900/50">
                    <IconShield className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      {roleDisplay}
                    </span>
                  </div>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Action Items */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <IconUser className="h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <IconSettings className="h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <IconBell className="h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <IconLogout className="h-4 w-4" />
              <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
