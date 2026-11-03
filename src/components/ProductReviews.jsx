import { Star } from "lucide-react";

function formatReviewDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export default function ProductReviews({ reviews = [] }) {
  return (
    <section className="product-reviews" aria-labelledby="product-reviews-title">
      <div className="product-reviews__heading">
        <div>
          <p className="product-reviews__eyebrow">Opiniones de clientes</p>
          <h2 id="product-reviews-title">Reseñas</h2>
        </div>
        <span className="product-reviews__count">
          {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
        </span>
      </div>

      {reviews.length ? (
        <div className="product-reviews__list">
          {reviews.map((review, index) => (
            <article className="review-card" key={`${review.date}-${index}`}>
              <div className="review-card__top">
                <div className="review-card__author">
                  <span className="review-card__avatar" aria-hidden="true">
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h3>{review.reviewerName}</h3>
                    {review.date && <time dateTime={review.date}>{formatReviewDate(review.date)}</time>}
                  </div>
                </div>
                <span className="review-card__rating" aria-label={`${review.rating} de 5 estrellas`}>
                  <Star size={15} aria-hidden="true" /> {review.rating}/5
                </span>
              </div>
              <p className="review-card__comment">{review.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="product-reviews__empty">Este producto todavía no tiene reseñas.</p>
      )}
    </section>
  );
}
