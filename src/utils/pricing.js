export function getFinalPrice(product) {
  const discount = product.discountPercentage ?? 0;
  return Math.round(product.price * (1 - discount / 100) * 100) / 100;
}

export function hasDiscount(product) {
  return getFinalPrice(product) < product.price;
}

export function getDiscountLabel(product) {
  const discount = product.discountPercentage ?? 0;
  return `-${Math.max(1, Math.round(discount))}%`;
}
