import { createBrowserRouter } from "react-router-dom";
import MainLaoyut from "../layouts/MainLayout";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLaoyut />,
    children: [
      { index: true, element: <Home /> },
      { path: "productos", element: <Products /> },
      { path: "productos/:id", element: <ProductDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
