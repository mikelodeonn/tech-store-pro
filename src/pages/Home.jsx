import { useEffect } from "react";
import { getProducts } from "../services/productService";

export default function Home() {
  useEffect(() => {
    getProducts().then((data) => console.log(data));
  }, []);

  return <h1>Inicio</h1>;
}