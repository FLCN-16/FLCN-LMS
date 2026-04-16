import {
  IconBolt,
  IconBooks,
  IconCategory,
  IconClipboardList,
  IconHelpCircle,
  IconPlus,
  IconQuestionMark,
} from "@tabler/icons-react"
import { Link } from "react-router-dom"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@flcn-lms/ui/components/dropdown-menu"
import { Separator } from "@flcn-lms/ui/components/separator"
import { SidebarTrigger } from "@flcn-lms/ui/components/sidebar"

const quickActions = [
  {
    label: "New Course",
    to: "/courses/new",
    icon: IconBooks,
  },
  {
    label: "New Category",
    to: "/course-categories/new",
    icon: IconCategory,
  },
  {
    label: "New Series",
    to: "/test-series/new",
    icon: IconClipboardList,
  },
  {
    label: "New Question",
    to: "/questions/new",
    icon: IconQuestionMark,
  },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4"
        />

        <div className="flex min-w-0 flex-1 items-center gap-3" />

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden md:flex"
          >
            <Link to="/panel">
              <IconHelpCircle className="size-4" />
              Dashboard
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <IconBolt className="size-4" />
                Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Jump Into Work</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickActions.map((action) => (
                <DropdownMenuItem key={action.to} asChild>
                  <Link to={action.to}>
                    <action.icon className="size-4" />
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/panel">
                  <IconPlus className="size-4" />
                  Go To Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
