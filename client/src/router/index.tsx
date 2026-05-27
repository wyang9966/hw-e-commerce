import { lazy } from "react";
import { createHashRouter } from "react-router-dom";

import GlobalErrorPage from "../components/errors/GlobalErrorPage";
import RouteErrorBoundary from "../components/errors/RouteErrorBoundary";
import RootLayout from "../components/layout/RootLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

const Home = lazy(() => import("../features/products/pages/Home"));
const Products = lazy(() => import("../features/products/pages/Products"));
const ProductDetail = lazy(() => import("../features/products/pages/ProductDetail"));
const Cart = lazy(() => import("../features/cart/pages/Cart"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const Signup = lazy(() => import("../features/auth/pages/Signup"));
const Settings = lazy(() => import("../features/settings/pages/Settings"));

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      {
        index: true,
        element: (
          <RouteErrorBoundary name="Home">
            <Home />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "products",
        element: (
          <RouteErrorBoundary name="Products">
            <Products />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "products/:id",
        element: (
          <RouteErrorBoundary name="Product Detail">
            <ProductDetail />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "login",
        element: (
          <RouteErrorBoundary name="Login">
            <Login />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "signup",
        element: (
          <RouteErrorBoundary name="Signup">
            <Signup />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "cart",
        element: (
          <RouteErrorBoundary name="Cart">
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          </RouteErrorBoundary>
        ),
      },
      {
        path: "settings",
        element: (
          <RouteErrorBoundary name="Settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </RouteErrorBoundary>
        ),
      },
    ],
  },
]);
