import type { Testimonial } from '../../model/testimonial';
import Style from './style.module.scss';

type TestimonialsProps = {
  testimonials: Testimonial[];
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className={Style['stars']} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(Math.max(0, 5 - rating))}
    </span>
  );
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className={Style['grid']}>
      {testimonials.map((t) => (
        <div key={t.id} className={Style['card']}>
          <Stars rating={t.rating} />
          <blockquote className={Style['quote']}>"{t.quote}"</blockquote>
          <footer className={Style['attribution']}>
            <strong>{t.clientName}</strong>
            {t.projectType && <span> — {t.projectType}</span>}
          </footer>
        </div>
      ))}
    </div>
  );
}
