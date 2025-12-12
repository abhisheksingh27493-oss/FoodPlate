import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import LoginPage from "./pages/Login";
import { SignUpPage } from "./pages/SignUp";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardPage from "./pages/Dashboard";
import AdminPage from "./pages/Admin";
import AuthSuccess from "./pages/AuthSuccess";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import FoodDetailsPage from "./pages/FoodDetailsPage";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />
          <Route
            path="/food/:id"
            element={
              <Layout>
                <FoodDetailsPage />
              </Layout>
            }
          />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* GOOGLE AUTH CALLBACK */}
          <Route path="/auth/success" element={<AuthSuccess />} />

          {/* ORDER & CHECKOUT ROUTES */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Layout>
                  <CartPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Layout>
                  <CheckoutPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/success"
            element={
              <ProtectedRoute>
                 <Layout>
                   <OrderSuccessPage />
                 </Layout>
              </ProtectedRoute>
            }
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute requiredRole="restaurant">
                <Layout>
                  <RestaurantDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTE */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
