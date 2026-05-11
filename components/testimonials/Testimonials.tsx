import { useState } from 'react';
import Style from './Testimonials.module.scss';
import type { Testimonial } from '../../model/testimonial';

type StarsProps = { rating: number; className?: string };

function Stars({ rating, className }: StarsProps) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className={[Style.stars, className].filter(Boolean).join(' ')} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full).split('').map((_, i) => (
        <span key={`f${i}`} className={Style.star}>
          <span className={Style.starBg}>☆</span>
          <span className={Style.starFg} style={{ width: '100%' }}>★</span>
        </span>
      ))}
      {half && (
        <span className={Style.star}>
          <span className={Style.starBg}>☆</span>
          <span className={Style.starFg} style={{ width: '50%' }}>★</span>
        </span>
      )}
      {'☆'.repeat(empty).split('').map((_, i) => (
        <span key={`e${i}`} className={Style.star}>
          <span className={Style.starBg}>☆</span>
          <span className={Style.starFg} style={{ width: '0%' }}>★</span>
        </span>
      ))}
    </span>
  );
}

type TestimonialsProps = { testimonials: Testimonial[] };

const GRID_LIMIT = 4;

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [showAll, setShowAll] = useState(false);
  const [featured, ...rest] = testimonials;
  const truncated = !showAll && rest.length > GRID_LIMIT;
  const visibleRest = truncated ? rest.slice(0, GRID_LIMIT) : rest;

  return (
    <div className={Style.wrapper}>
      {featured && (
        <div className={Style.featured}>
          <Stars rating={featured.rating} className={Style.featuredStars} />
          <blockquote className={Style.featuredQuote}>&ldquo;{featured.quote}&rdquo;</blockquote>
          <footer className={Style.attribution}>
            <strong>{featured.clientName}</strong>
          </footer>
        </div>
      )}
      {visibleRest.length > 0 && (
        <div className={Style.grid}>
          {visibleRest.map((t, i) => (
            <div key={i} className={Style.card}>
              <Stars rating={t.rating} />
              <blockquote className={Style.quote}>&ldquo;{t.quote}&rdquo;</blockquote>
              <footer className={Style.attribution}>
                <strong>{t.clientName}</strong>
              </footer>
            </div>
          ))}
        </div>
      )}
      {truncated && (
        <button className={Style.showMore} onClick={() => setShowAll(true)}>
          More reviews &rarr;
        </button>
      )}
    </div>
  );
}
