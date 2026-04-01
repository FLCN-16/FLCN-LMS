import {
  Alert01Icon,
  BarChartIcon,
  Book01Icon,
  Briefcase03Icon,
  Building02Icon,
  Calendar02Icon,
  CheckListIcon,
  CreditCardIcon,
  GraduationCap,
  Home01Icon,
  Megaphone02Icon,
  NoteEditIcon,
  PercentIcon,
  Settings05Icon,
  ShapesIcon,
  StarIcon,
  User02Icon,
  UserCheck01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { type IconSvgElement } from "@hugeicons/react"

import type { PermissionDescriptor } from "@flcn-lms/types/auth"

export const iconMap: Record<string, IconSvgElement> = {
  gauge: Home01Icon,
  "chart-bar": BarChartIcon,
  "graduation-cap": GraduationCap,
  shapes: ShapesIcon,
  "notepad-text": NoteEditIcon,
  "user-check": UserCheck01Icon,
  "clipboard-list": CheckListIcon,
  "book-open": Book01Icon,
  "file-spreadsheet": CheckListIcon,
  trophy: StarIcon,
  sparkles: StarIcon,
  "panels-top-left": Book01Icon,
  users: User02Icon,
  "briefcase-business": Briefcase03Icon,
  building2: Building02Icon,
  "user-cog": Settings05Icon,
  "credit-card": CreditCardIcon,
  "ticket-percent": PercentIcon,
  wallet: Wallet02Icon,
  megaphone: Megaphone02Icon,
  bell: Alert01Icon,
  settings: Settings05Icon,
  "calendar-days": Calendar02Icon,
}

export interface SidebarNavItem {
  title: string
  url: string
  icon?: string
  children?: { title: string; url: string; permission?: PermissionDescriptor }[]
  permission?: PermissionDescriptor
}

export const navigation: Record<string, SidebarNavItem[]> = {
  main: [
    { title: "Dashboard", url: "/", icon: "gauge" },
    { title: "Analytics", url: "/analytics", icon: "chart-bar" },
  ],

  courses: [
    { title: "Courses", url: "/courses", icon: "graduation-cap" },
    {
      title: "Course Categories",
      url: "/course-categories",
      icon: "shapes",
    },
    { title: "DPP", url: "/dpp", icon: "notepad-text" },
    {
      title: "Content Review",
      url: "/content-review",
      icon: "user-check",
    },
  ],

  testSeries: [
    { title: "Test Series", url: "/test-series", icon: "clipboard-list" },
    { title: "Question Bank", url: "/questions", icon: "book-open" },
    { title: "Attempts", url: "/attempts", icon: "file-spreadsheet" },
    { title: "Leaderboard", url: "/leaderboard", icon: "trophy" },
    { title: "Exam Types", url: "/exam-types", icon: "sparkles" },
  ],

  live: [
    {
      title: "Live Classes",
      url: "/live-classes",
      icon: "panels-top-left",
    },
  ],

  institute: [
    { title: "Students", url: "/institute/students", icon: "users" },
    {
      title: "Faculty",
      url: "/institute/faculty",
      icon: "briefcase-business",
    },
    { title: "Batches", url: "/institute/batches", icon: "building2" },
    {
      title: "Attendance",
      url: "/institute/attendance",
      icon: "calendar-days",
    },
    {
      title: "Timetable",
      url: "/institute/timetable",
      icon: "calendar-days",
    },
    {
      title: "Roles & Permissions",
      url: "/institute/roles-permissions",
      icon: "user-cog",
    },
  ],

  revenue: [
    {
      title: "Transactions",
      url: "/revenue/transactions",
      icon: "credit-card",
    },
    { title: "Coupons", url: "/revenue/coupons", icon: "ticket-percent" },
    { title: "Refunds", url: "/revenue/refunds", icon: "wallet" },
  ],

  communications: [
    {
      title: "Announcements",
      url: "/communications/announcements",
      icon: "megaphone",
    },
    {
      title: "Push Notifications",
      url: "/communications/push-notifications",
      icon: "bell",
    },
  ],

  settings: [
    { title: "Branding", url: "/settings/branding", icon: "sparkles" },
    {
      title: "Integrations",
      url: "/settings/integrations",
      icon: "settings",
    },
  ],
}

export const dashboardNavItems = navigation.main
export const coursesNavItems = navigation.courses
export const testSeriesNavItems = navigation.testSeries
export const liveNavItems = navigation.live
export const instituteAdminNavItems = navigation.institute
export const revenueNavItems = navigation.revenue
export const communicationsNavItems = navigation.communications
export const settingsNavItems = navigation.settings

export const sidebarSections = [
  { label: "Courses", items: navigation.courses },
  { label: "Test Series", items: navigation.testSeries },
  { label: "Live", items: navigation.live },
  { label: "Institute", items: navigation.institute },
  { label: "Revenue", items: navigation.revenue },
  { label: "Communications", items: navigation.communications },
  { label: "Settings", items: navigation.settings },
]
