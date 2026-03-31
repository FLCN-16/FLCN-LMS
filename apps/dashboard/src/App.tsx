import { lazy } from "react"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

const ProtectedRoute = lazy(() => import("./components/protected-route"))
const AuthLayout = lazy(() => import("./layout/auth"))
const DashboardLayout = lazy(() => import("./layout/dashboard"))
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
const AttemptsPage = lazy(() => import("./pages/attempts"))
const AttemptResultPage = lazy(() => import("./pages/attempts/result"))
const LeaderboardPage = lazy(() => import("./pages/leaderboard"))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected panel routes */}
        <Route path="/panel" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<HomePage />} />

            {/* Question Bank */}
            <Route path="questions" element={<QuestionsPage />} />
            <Route path="questions/new" element={<NewQuestionPage />} />
            <Route path="questions/:id/edit" element={<EditQuestionPage />} />

            {/* Test Series */}
            <Route path="test-series" element={<TestSeriesPage />} />
            <Route path="test-series/new" element={<NewTestSeriesPage />} />
            <Route path="test-series/:seriesId" element={<TestsPage />} />
            <Route
              path="test-series/:seriesId/edit"
              element={<EditTestSeriesPage />}
            />
            <Route
              path="test-series/:seriesId/tests/new"
              element={<NewTestPage />}
            />
            <Route
              path="test-series/:seriesId/tests/:testId/edit"
              element={<EditTestPage />}
            />

            {/* Attempts */}
            <Route path="attempts" element={<AttemptsPage />} />
            <Route
              path="attempts/:attemptId/result"
              element={<AttemptResultPage />}
            />

            {/* Leaderboard */}
            <Route path="leaderboard" element={<LeaderboardPage />} />

            {/* Exam Types */}
            <Route path="exam-types" element={<ExamTypesPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/panel" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
