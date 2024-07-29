import { Routes, Route } from "react-router-dom";
import { RequiresAuthProvider } from "../context/RequiresAuthProvider";
import {
  TermsAndConditions,
  Applications,
  Dashboard,
  Login,
  Profile,
  Users,
  EmailDisclaimer,
} from "../domain";
import { AgentsPage } from "../domain/agent/pages/AgentsPage";
import { AgentViewPage } from "../domain/agent/pages/AgentViewPage";
import { ForgotPassword } from "../domain/ForgotPassword";
import { RoutePath } from "../utils/utils";

export function AllRoutes() {
  return (
    <Routes>
      <Route
        path={RoutePath.HOME}
        element={
          <RequiresAuthProvider>
            <Dashboard />
          </RequiresAuthProvider>
        }
      />
      <Route path={RoutePath.LOGIN} element={<Login />} />
      <Route path={RoutePath.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route
        path={RoutePath.DASHBOARD}
        element={
          <RequiresAuthProvider>
            <Dashboard />
          </RequiresAuthProvider>
        }
      />
      <Route
        path={RoutePath.PROFILE}
        element={
          <RequiresAuthProvider>
            <Profile />
          </RequiresAuthProvider>
        }
      />

      <Route
        path={RoutePath.USERS}
        element={
          <RequiresAuthProvider>
            <Users />
          </RequiresAuthProvider>
        }
      />
      <Route
        path={RoutePath.APPLICATIONS}
        element={
          <RequiresAuthProvider>
            <Applications />
          </RequiresAuthProvider>
        }
      />
      <Route
        path={RoutePath.NEW_APPLICATIONS}
        element={
          <RequiresAuthProvider>
            <Applications />
          </RequiresAuthProvider>
        }
      />
      <Route
        path={RoutePath.TERMS_AND_CONDITIONS}
        element={<TermsAndConditions />}
      />
      <Route path={RoutePath.EMAIL_DISCLAIMER} element={<EmailDisclaimer />} />

      <Route
        path={RoutePath.AGENT}
        element={
          <RequiresAuthProvider allowedRoles={["SUPER_ADMIN"]}>
            <AgentsPage />
          </RequiresAuthProvider>
        }
      />

      <Route
        path={RoutePath.AGENT + "/:agentId"}
        element={
          <RequiresAuthProvider allowedRoles={["SUPER_ADMIN"]}>
            <AgentViewPage />
          </RequiresAuthProvider>
        }
      />
    </Routes>
  );
}
