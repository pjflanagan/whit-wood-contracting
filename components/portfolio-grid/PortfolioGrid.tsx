import { useState } from 'react';
import type { PortfolioItem } from '../../model/portfolio-item';
import { Modal } from '../modal';
import Style from './PortfolioGrid.module.scss';

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export function PortfolioGrid({ items }: PortfolioGridProps) {
  const [active, setActive] = useState<PortfolioItem | null>(null);

  return (
    <>
      <div className={Style.grid}>
        {items.map((item) => (
          <button key={item.id} className={Style.card} onClick={() => setActive(item)}>
            <div className={Style.imageWrapper}>
              {item.photos[0] ? (
                <img src={item.photos[0]} alt={item.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              ) : (
                <div className={Style.placeholder}>
                  <span>{item.type}</span>
                </div>
              )}
            </div>
            <div className={Style.info}>
              <span className={Style.category}>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <Modal
          title={active.title}
          description={active.description}
          images={active.photos}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
