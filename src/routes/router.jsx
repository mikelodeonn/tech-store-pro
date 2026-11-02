import { createBrowserRouter } from "react-router-dom";
import MainLaoyut from "../layouts/MainLayout";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Account from "../pages/Account";
import Cart from "../pages/Cart";
import ProtectedRoute from "../components/ProtectedRoute";      

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLaoyut />,
    children: [
      { path: "login", element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "mi-cuenta", element: <Account /> }],
      },
      { index: true, element: <Home /> },
      { path: "productos", element: <Products /> },
      { path: "productos/:id", element: <ProductDetail /> },
      { path: "*", element: <NotFound /> },
      {path: "carrito", element: <Cart />},
    ],
  },
]);
