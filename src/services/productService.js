import { request } from "./api";
import { mapProduct } from "../models/product";

export async function getProducts(limit = 12, skip = 0) {
  const data = await request(`/products?limit=${limit}&skip=${skip}`);
  return { ...data, products: data.products.map(mapProduct) };
}

export async function getProductById(id) {
  const data = await request(`/products/${id}`);
  return mapProduct(data);
}

export async function getCategories() {
  return request("/products/categories");
}

export async function getProductsByCategory(category) {
  const data = await request(`/products/category/${category}`);
  return data.products.map(mapProduct);
}

export async function searchProducts(query) {
  const data = await request(`/products/search?q=${encodeURIComponent(query)}`);
  return data.products.map(mapProduct);
}

export async function getfeaturedProducts (limit = 8) {
  const data = await request(`/products?sortBy=rating&order=desc&limit=${limit}`);
  return data.products.map(mapProduct);
}

export async function getAllProducts() {
  const data = await request("/products");
  return data.products.map(mapProduct);
}