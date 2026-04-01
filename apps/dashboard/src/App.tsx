import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { lazy } from "react"

import type { PermissionDescriptor } from "@flcn-lms/types/auth"

import { ProtectedRoute } from "@/components/protected-route"
import withAuth from "@/features/auth/with-auth.hoc"

const AuthLayout = lazy(() => import("./layouts/auth"))
const DashboardLayout = lazy(() => import("./layouts/dashboard"))
const ForgotPasswordPage = lazy(() => import("./pages/auth/forgot-password"))
const LoginPage = lazy(() => import("./pages/auth/login"))
const ResetPasswordPage = lazy(() => import("./pages/auth/reset-password"))
const HomePage = lazy(() => import("./pages/home"))
const QuestionsPage = lazy(() => import("./pages/questions"))
const NewQuestionPage = lazy(() => import("./pages/questions/new"))
const EditQuestionPage = lazy(() => import("./pages/questions/edit"))
const TestSeriesPage = lazy(() => import("./pages/test-series"))
const NewTestSeriesPage = lazy(() => import("./pages/test-series/new"))
const EditTestSeriesPage = lazy(() => import("./pages/test-series/edit"))
const TestsPage = lazy(() => import("./pages/test-series/tests"))
const NewTestPage = lazy(() => import("./pages/test-series/new-test"))
const EditTestPage = lazy(() => import("./pages/test-series/edit-test"))
const ExamTypesPage = lazy(() => import("./pages/exam-types"))
const DppPage = lazy(() => import("./pages/dpp"))
const NewDppPage = lazy(() => import("./pages/dpp/new"))
const AttemptsPage = lazy(() => import("./pages/attempts"))
const AttemptResultPage = lazy(() => import("./pages/attempts/result"))
const LiveClassesPage = lazy(() => import("./pages/live-classes"))
const NewLiveClassPage = lazy(() => import("./pages/live-classes/new"))
const ContentReviewPage = lazy(() => import("./pages/content-review"))
const RevenueTransactionsPage = lazy(
  () => import("./pages/revenue/transactions")
)
const RevenueCouponsPage = lazy(() => import("./pages/revenue/coupons"))
const RevenueRefundsPage = lazy(() => import("./pages/revenue/refunds"))
const AnalyticsOverviewPage = lazy(() => import("./pages/analytics"))
const CourseReportsPage = lazy(() => import("./pages/analytics/course-reports"))
const TestReportsPage = lazy(() => import("./pages/analytics/test-reports"))
const AnnouncementsPage = lazy(
  () => import("./pages/communications/announcements")
)
const PushNotificationsPage = lazy(
  () => import("./pages/communications/push-notifications")
)
const CourseCategoriesPage = lazy(() => import("./pages/course-categories"))
const NewCourseCategoryPage = lazy(
  () => import("./pages/course-categories/new")
)
const EditCourseCategoryPage = lazy(
  () => import("./pages/course-categories/edit")
)
const CoursesPage = lazy(() => import("./pages/courses"))
const NewCoursePage = lazy(() => import("./pages/courses/new"))
const EditCoursePage = lazy(() => import("./pages/courses/edit"))
const InstituteStudentsPage = lazy(() => import("./pages/institute/students"))
const InstituteFacultyPage = lazy(() => import("./pages/institute/faculty"))
const InstituteBatchesPage = lazy(() => import("./pages/institute/batches"))
const InstituteAttendancePage = lazy(
  () => import("./pages/institute/attendance")
)
const InstituteRolesPermissionsPage = lazy(
  () => import("./pages/institute/roles-permissions")
)
const InstituteSettingsPage = lazy(() => import("./pages/institute/settings"))
const InstituteTimetablePage = lazy(() => import("./pages/institute/timetable"))
const LeaderboardPage = lazy(() => import("./pages/leaderboard"))
const BrandingSettingsPage = lazy(() => import("./pages/settings/branding"))
const IntegrationsSettingsPage = lazy(
  () => import("./pages/settings/integrations")
)

const ProtectedDashboardLayout = withAuth(DashboardLayout)

function withPermission(
  element: React.ReactNode,
  permission?: PermissionDescriptor
) {
  return <ProtectedRoute permission={permission}>{element}</ProtectedRoute>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/" element={<ProtectedDashboardLayout />}>
          <Route
            index
            element={withPermission(<HomePage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />

          <Route
            path="questions"
            element={withPermission(<QuestionsPage />, {
              action: "read",
              subject: "Question",
            })}
          />
          <Route
            path="questions/new"
            element={withPermission(<NewQuestionPage />, {
              action: "create",
              subject: "Question",
            })}
          />
          <Route
            path="questions/:id/edit"
            element={withPermission(<EditQuestionPage />, {
              action: "update",
              subject: "Question",
            })}
          />

          <Route
            path="test-series"
            element={withPermission(<TestSeriesPage />, {
              action: "read",
              subject: "TestSeries",
            })}
          />
          <Route
            path="test-series/new"
            element={withPermission(<NewTestSeriesPage />, {
              action: "create",
              subject: "TestSeries",
            })}
          />
          <Route
            path="test-series/:seriesId"
            element={withPermission(<TestsPage />, {
              action: "read",
              subject: "Test",
            })}
          />
          <Route
            path="test-series/:seriesId/edit"
            element={withPermission(<EditTestSeriesPage />, {
              action: "update",
              subject: "TestSeries",
            })}
          />
          <Route
            path="test-series/:seriesId/tests/new"
            element={withPermission(<NewTestPage />, {
              action: "create",
              subject: "Test",
            })}
          />
          <Route
            path="test-series/:seriesId/tests/:testId/edit"
            element={withPermission(<EditTestPage />, {
              action: "update",
              subject: "Test",
            })}
          />

          <Route
            path="attempts"
            element={withPermission(<AttemptsPage />, {
              action: "read",
              subject: "Attempt",
            })}
          />
          <Route
            path="attempts/:attemptId/result"
            element={withPermission(<AttemptResultPage />, {
              action: "read",
              subject: "Attempt",
            })}
          />
          <Route
            path="dpp"
            element={withPermission(<DppPage />, {
              action: "read",
              subject: "Dpp",
            })}
          />
          <Route
            path="dpp/new"
            element={withPermission(<NewDppPage />, {
              action: "create",
              subject: "Dpp",
            })}
          />

          <Route
            path="institute/students"
            element={withPermission(<InstituteStudentsPage />, {
              action: "read",
              subject: "Student",
            })}
          />
          <Route
            path="institute/faculty"
            element={withPermission(<InstituteFacultyPage />, {
              action: "read",
              subject: "Faculty",
            })}
          />
          <Route
            path="institute/batches"
            element={withPermission(<InstituteBatchesPage />, {
              action: "read",
              subject: "Batch",
            })}
          />
          <Route
            path="institute/attendance"
            element={withPermission(<InstituteAttendancePage />, {
              action: "read",
              subject: "Faculty",
            })}
          />
          <Route
            path="institute/roles-permissions"
            element={withPermission(<InstituteRolesPermissionsPage />, {
              action: "read",
              subject: "RolePermission",
            })}
          />
          <Route
            path="institute/settings"
            element={withPermission(<InstituteSettingsPage />, {
              action: "read",
              subject: "Setting",
            })}
          />
          <Route
            path="institute/timetable"
            element={withPermission(<InstituteTimetablePage />, {
              action: "read",
              subject: "Faculty",
            })}
          />
          <Route
            path="live-classes"
            element={withPermission(<LiveClassesPage />, {
              action: "read",
              subject: "LiveClass",
            })}
          />
          <Route
            path="live-classes/new"
            element={withPermission(<NewLiveClassPage />, {
              action: "create",
              subject: "LiveClass",
            })}
          />
          <Route
            path="content-review"
            element={withPermission(<ContentReviewPage />, {
              action: "read",
              subject: "ContentReview",
            })}
          />
          <Route
            path="revenue/transactions"
            element={withPermission(<RevenueTransactionsPage />, {
              action: "read",
              subject: "Transaction",
            })}
          />
          <Route
            path="revenue/coupons"
            element={withPermission(<RevenueCouponsPage />, {
              action: "read",
              subject: "Coupon",
            })}
          />
          <Route
            path="revenue/refunds"
            element={withPermission(<RevenueRefundsPage />, {
              action: "read",
              subject: "Refund",
            })}
          />
          <Route
            path="analytics"
            element={withPermission(<AnalyticsOverviewPage />, {
              action: "read",
              subject: "Analytics",
            })}
          />
          <Route
            path="analytics/course-reports"
            element={withPermission(<CourseReportsPage />, {
              action: "read",
              subject: "Analytics",
            })}
          />
          <Route
            path="analytics/test-reports"
            element={withPermission(<TestReportsPage />, {
              action: "read",
              subject: "Analytics",
            })}
          />
          <Route
            path="communications/announcements"
            element={withPermission(<AnnouncementsPage />, {
              action: "read",
              subject: "Announcement",
            })}
          />
          <Route
            path="communications/push-notifications"
            element={withPermission(<PushNotificationsPage />, {
              action: "read",
              subject: "Notification",
            })}
          />
          <Route
            path="settings/branding"
            element={withPermission(<BrandingSettingsPage />, {
              action: "read",
              subject: "Branding",
            })}
          />
          <Route
            path="settings/integrations"
            element={withPermission(<IntegrationsSettingsPage />, {
              action: "read",
              subject: "Integration",
            })}
          />

          <Route
            path="course-categories"
            element={withPermission(<CourseCategoriesPage />, {
              action: "read",
              subject: "CourseCategory",
            })}
          />
          <Route
            path="course-categories/new"
            element={withPermission(<NewCourseCategoryPage />, {
              action: "create",
              subject: "CourseCategory",
            })}
          />
          <Route
            path="course-categories/:categoryId/edit"
            element={withPermission(<EditCourseCategoryPage />, {
              action: "update",
              subject: "CourseCategory",
            })}
          />
          <Route
            path="courses"
            element={withPermission(<CoursesPage />, {
              action: "read",
              subject: "Course",
            })}
          />
          <Route
            path="courses/new"
            element={withPermission(<NewCoursePage />, {
              action: "create",
              subject: "Course",
            })}
          />
          <Route
            path="courses/:courseId/edit"
            element={withPermission(<EditCoursePage />, {
              action: "update",
              subject: "Course",
            })}
          />

          <Route
            path="leaderboard"
            element={withPermission(<LeaderboardPage />, {
              action: "read",
              subject: "Leaderboard",
            })}
          />

          <Route
            path="exam-types"
            element={withPermission(<ExamTypesPage />, {
              action: "read",
              subject: "ExamType",
            })}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
