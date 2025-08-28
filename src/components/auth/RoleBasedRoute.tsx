// import { Navigate } from "react-router";
// import { useAuth } from "@/hooks/useAuth";
// import type { ReactNode  } from "react";

// interface RoleBasedRouteProps {
//   children: ReactNode;
//   allowedRoles: string[];
// }

// export const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };
