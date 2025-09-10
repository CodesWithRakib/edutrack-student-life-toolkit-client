import { createBrowserRouter } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Student Pages
import Schedule from "@/pages/Dashboard/student/Schedule";
import Budget from "@/pages/Dashboard/student/Budget";
import ExamQA from "@/pages/Dashboard/student/ExamQA";
import Planner from "@/pages/Dashboard/student/Planner";
import Performance from "@/pages/Dashboard/student/Performance";

// Admin Pages
import ManageUsersPage from "@/pages/Dashboard/admin/ManageUsers";
// Existing Pages
import Home from "@/pages/landing/Home";
import Features from "@/pages/Features";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import NotFound from "@/pages/Errors/NotFound";
import Unauthorized from "@/pages/Errors/Unauthorized";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ExamManager from "@/pages/Dashboard/student/ExamManager";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "features",
        element: <Features />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Student Routes
      {
        path: "student/schedule",
        element: <Schedule />,
      },
      {
        path: "student/budget",
        element: <Budget />,
      },
      {
        path: "student/planner",
        element: <Planner />,
      },
      {
        path: "student/qa",
        element: <ExamQA />,
      },
      {
        path: "student/performance",
        element: <Performance />,
      },

      {
        path: "student/exam-generator",
        element: <ExamManager />,
      },

      // Admin Routes
      {
        path: "admin/users",
        element: <ManageUsersPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// ==================
// ==================

// import PublicLayout from "@/layouts/PublicLayout";
// import DashboardLayout from "@/layouts/DashboardLayout";
// import AuthLayout from "@/layouts/AuthLayout";
// import Home from "@/pages/landing/Home";
// import Features from "@/pages/Features";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";
// import Login from "@/pages/Auth/Login";
// import Register from "@/pages/Auth/Register";
// import ForgotPassword from "@/pages/Auth/ForgotPassword";
// import ResetPassword from "@/pages/Auth/ResetPassword";
// import Dashboard from "@/pages/Dashboard/Dashboard";
// import Schedule from "@/pages/Dashboard/Schedule";
// import Budget from "@/pages/Dashboard/Budget";
// import Planner from "@/pages/Dashboard/Planner";
// import ExamQA from "@/pages/Dashboard/ExamQA";
// import Performance from "@/pages/Dashboard/Performance";
// import Resources from "@/pages/Dashboard/Resources";
// import ManageQA from "@/pages/Dashboard/ManageQA";
// import StudentManagement from "@/pages/Dashboard/StudentManagement";
// import Assignments from "@/pages/Dashboard/Assignments";
// import ManageUsers from "@/pages/Dashboard/ManageUsers";
// import ManageContent from "@/pages/Dashboard/ManageContent";
// import Analytics from "@/pages/Dashboard/Analytics";
// import SystemSettings from "@/pages/Dashboard/SystemSettings";
// import Profile from "@/pages/Dashboard/Profile";
// import Settings from "@/pages/Dashboard/Settings";
// import NotFound from "@/pages/Errors/NotFound";
// import Unauthorized from "@/pages/Errors/Unauthorized";
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <PublicLayout />,
//     errorElement: <NotFound />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "features",
//         element: <Features />,
//       },
//       {
//         path: "about",
//         element: <About />,
//       },
//       {
//         path: "contact",
//         element: <Contact />,
//       },
//       {
//         path: "unauthorized",
//         element: <Unauthorized />,
//       },
//     ],
//   },
//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "login",
//         element: <Login />,
//       },
//       {
//         path: "register",
//         element: <Register />,
//       },
//       {
//         path: "forgot-password",
//         element: <ForgotPassword />,
//       },
//       {
//         path: "reset-password",
//         element: <ResetPassword />,
//       },
//     ],
//   },
//   {
//     path: "/dashboard",
//     element: (
//       <ProtectedRoute>
//         <DashboardLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       {
//         index: true,
//         element: <Dashboard />,
//       },
//       // Student Routes
//       {
//         path: "schedule",
//         element: (
//           <RoleBasedRoute allowedRoles={["student", "admin"]}>
//             <Schedule />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "budget",
//         element: (
//           <RoleBasedRoute allowedRoles={["student", "admin"]}>
//             <Budget />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "planner",
//         element: (
//           <RoleBasedRoute allowedRoles={["student", "admin"]}>
//             <Planner />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "qa",
//         element: (
//           <RoleBasedRoute allowedRoles={["student", "admin"]}>
//             <ExamQA />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "performance",
//         element: (
//           <RoleBasedRoute allowedRoles={["student", "admin"]}>
//             <Performance />
//           </RoleBasedRoute>
//         ),
//       },
// Teacher Routes
//       {
//         path: "resources",
//         element: (
//           <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
//             <Resources />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "qa-manage",
//         element: (
//           <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
//             <ManageQA />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "students",
//         element: (
//           <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
//             <StudentManagement />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "assignments",
//         element: (
//           <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
//             <Assignments />
//           </RoleBasedRoute>
//         ),
//       },
//       // Admin Routes
//       {
//         path: "users",
//         element: (
//           <RoleBasedRoute allowedRoles={["admin"]}>
//             <ManageUsers />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "content",
//         element: (
//           <RoleBasedRoute allowedRoles={["admin"]}>
//             <ManageContent />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "analytics",
//         element: (
//           <RoleBasedRoute allowedRoles={["admin"]}>
//             <Analytics />
//           </RoleBasedRoute>
//         ),
//       },
//       {
//         path: "system-settings",
//         element: (
//           <RoleBasedRoute allowedRoles={["admin"]}>
//             <SystemSettings />
//           </RoleBasedRoute>
//         ),
//       },
//       // Common Routes
//       {
//         path: "profile",
//         element: <Profile />,
//       },
//       {
//         path: "settings",
//         element: <Settings />,
//       },
//     ],
//   },
// {
//   path: "*",
//   element: <NotFound />,
// },
// ]);
