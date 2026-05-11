import Style from './Testimonials.module.scss';
import type { Testimonial } from '../../model/testimonial';

type StarsProps = { rating: number };

function Stars({ rating }: StarsProps) {
  return (
    <span className={Style.stars} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

type TestimonialsProps = { testimonials: Testimonial[] };

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className={Style.grid}>
      {testimonials.map((t) => (
        <div key={t.id} className={Style.card}>
          <Stars rating={t.rating} />
          <blockquote className={Style.quote}>&ldquo;{t.quote}&rdquo;</blockquote>
          <footer className={Style.attribution}>
            <strong>{t.clientName}</strong>
          </footer>
        </div>
      ))}
    </div>
  );
}
