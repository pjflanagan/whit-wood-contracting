import Image from 'next/image';
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
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div className={Style.placeholder}>
                  <span>{item.category}</span>
                </div>
              )}
            </div>
            <div className={Style.info}>
              <span className={Style.category}>{item.category}</span>
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
          images={active.imageUrl ? [active.imageUrl] : []}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
