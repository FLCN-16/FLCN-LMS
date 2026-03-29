import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import ProtectedRoute from "./components/protected-route"
import AuthLayout from "./layout/auth"
import DashboardLayout from "./layout/dashboard"
import ForgotPasswordPage from "./pages/auth/forgot-password"
import LoginPage from "./pages/auth/login"
import ResetPasswordPage from "./pages/auth/reset-password"
import HomePage from "./pages/home"
import QuestionsPage from "./pages/questions"
import NewQuestionPage from "./pages/questions/new"
import EditQuestionPage from "./pages/questions/edit"
import TestSeriesPage from "./pages/test-series"
import NewTestSeriesPage from "./pages/test-series/new"
import EditTestSeriesPage from "./pages/test-series/edit"
import TestsPage from "./pages/test-series/tests"
import NewTestPage from "./pages/test-series/new-test"
import EditTestPage from "./pages/test-series/edit-test"
import ExamTypesPage from "./pages/exam-types"
import AttemptsPage from "./pages/attempts"
import AttemptResultPage from "./pages/attempts/result"
import LeaderboardPage from "./pages/leaderboard"

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
                        <Route path="test-series/:seriesId/edit" element={<EditTestSeriesPage />} />
                        <Route path="test-series/:seriesId/tests/new" element={<NewTestPage />} />
                        <Route path="test-series/:seriesId/tests/:testId/edit" element={<EditTestPage />} />

                        {/* Attempts */}
                        <Route path="attempts" element={<AttemptsPage />} />
                        <Route path="attempts/:attemptId/result" element={<AttemptResultPage />} />

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
