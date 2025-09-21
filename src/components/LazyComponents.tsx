import { lazy } from "react";

export const LazyHome = lazy(() => import("../pages/Home"));
export const LazyLogin = lazy(() => import("../pages/Login/"));
export const LazyRegister = lazy(() => import("../pages/Register/"));
export const LazyAccount = lazy(() => import("../pages/Account/"));
export const LazyCreditApplication = lazy(
  () => import("../pages/CreditApplication")
);

export const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      fontSize: "18px",
    }}>
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #d4a574",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}></div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);
