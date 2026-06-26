import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { UserDetailPage } from "./pages/UserDetailPage";
import { UserSubscriptionsPage } from "./pages/UserSubscriptionsPage";
import { UserPaymentsPage } from "./pages/UserPaymentsPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { PaymentDetailPage } from "./pages/PaymentDetailPage";
import { SubscriptionPlansPage } from "./pages/SubscriptionPlansPage";
import { CareTaskGenerationPage } from "./pages/CareTaskGenerationPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFound } from "./routes/NotFound";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:userId" element={<UserDetailPage />} />
                <Route path="/users/:userId/subscriptions" element={<UserSubscriptionsPage />} />
                <Route path="/users/:userId/payments" element={<UserPaymentsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/payments/:paymentTransactionId" element={<PaymentDetailPage />} />
                <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
                <Route path="/background-jobs/care-task-generation" element={<CareTaskGenerationPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
