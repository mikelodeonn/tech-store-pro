/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {number} price
 * @property {number} discountPercentage
 * @property {number} rating
 * @property {{ rating: number, comment: string, date: string, reviewerName: string }[]} reviews
 * @property {number} stock
 * @property {string} brand
 * @property {string} thumbnail
 * @property {string[]} images
 */

export function mapProduct(p) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    price: p.price,
    discountPercentage: p.discountPercentage ?? 0,
    rating: p.rating ?? 0,
    reviews: Array.isArray(p.reviews)
      ? p.reviews.map((review) => ({
          rating: review.rating ?? 0,
          comment: review.comment ?? "",
          date: review.date ?? "",
          reviewerName: review.reviewerName ?? "Cliente",
        }))
      : [],
    stock: p.stock ?? 0,
    brand: p.brand ?? "Sin marca",
    thumbnail: p.thumbnail,
    images: p.images ?? [],
  };
}
