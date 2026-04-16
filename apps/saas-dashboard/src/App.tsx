import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { lazy } from "react"

import type { PermissionDescriptor } from "@flcn-lms/types/auth"

import { ProtectedRoute } from "@/components/protected-route"
import withAuth from "@/features/auth/with-auth.hoc"

const AuthLayout = lazy(() => import("./layouts/auth"))
const DashboardLayout = lazy(() => import("./layouts/dashboard"))
const LoginPage = lazy(() => import("./pages/auth/login"))
const ForgotPasswordPage = lazy(() => import("./pages/auth/forgot-password"))
const ResetPasswordPage = lazy(() => import("./pages/auth/reset-password"))

// SaaS Pages
const HomePage = lazy(() => import("./pages/home"))
const SuperAdminsPage = lazy(() => import("./pages/super-admins"))
const SuperAdminFormPage = lazy(() => import("./pages/super-admins/form"))
const CustomersPage = lazy(() => import("./pages/customers"))
const CustomerFormPage = lazy(() => import("./pages/customers/form"))
const PlansPage = lazy(() => import("./pages/plans"))
const PlanFormPage = lazy(() => import("./pages/plans/form"))
const LicensesPage = lazy(() => import("./pages/licenses"))
const LicenseDetailPage = lazy(() => import("./pages/licenses/detail"))
const LicenseFormPage = lazy(() => import("./pages/licenses/form"))
const SubscriptionsPage = lazy(() => import("./pages/subscriptions"))
const ApiKeysPage = lazy(() => import("./pages/api-keys"))
const ApiKeyFormPage = lazy(() => import("./pages/api-keys/form"))
const BillingPage = lazy(() => import("./pages/billing"))
const InvoicesPage = lazy(() => import("./pages/invoices"))
const RefundsPage = lazy(() => import("./pages/refunds"))

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
            path="super-admins"
            element={withPermission(<SuperAdminsPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="customers"
            element={withPermission(<CustomersPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="plans"
            element={withPermission(<PlansPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="licenses"
            element={withPermission(<LicensesPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="subscriptions"
            element={withPermission(<SubscriptionsPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="api-keys"
            element={withPermission(<ApiKeysPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="billing"
            element={withPermission(<BillingPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="invoices"
            element={withPermission(<InvoicesPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />
          <Route
            path="refunds"
            element={withPermission(<RefundsPage />, {
              action: "read",
              subject: "Dashboard",
            })}
          />

          {/* Licenses CRUD */}
          <Route path="licenses/new" element={<LicenseFormPage />} />
          <Route path="licenses/:id" element={<LicenseDetailPage />} />
          <Route path="licenses/:id/edit" element={<LicenseFormPage />} />

          {/* Plans CRUD */}
          <Route path="plans/new" element={<PlanFormPage />} />
          <Route path="plans/:id/edit" element={<PlanFormPage />} />

          {/* Super Admins CRUD */}
          <Route path="super-admins/new" element={<SuperAdminFormPage />} />
          <Route path="super-admins/:id/edit" element={<SuperAdminFormPage />} />

          {/* Customers CRUD */}
          <Route path="customers/new" element={<CustomerFormPage />} />
          <Route path="customers/:id/edit" element={<CustomerFormPage />} />

          {/* API Keys CRUD */}
          <Route path="api-keys/new" element={<ApiKeyFormPage />} />
          <Route path="api-keys/:id/edit" element={<ApiKeyFormPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
