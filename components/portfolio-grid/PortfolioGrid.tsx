import { useState } from 'react';
import type { PortfolioItem } from '../../model/portfolio-item';
import { Modal } from '../modal';
import Style from './PortfolioGrid.module.scss';

type PortfolioGridProps = {
  items: PortfolioItem[];
};

const GRID_LIMIT = 3;

export function PortfolioGrid({ items }: PortfolioGridProps) {
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<PortfolioItem | null>(null);
  const truncated = !showAll && items.length > GRID_LIMIT;
  const visible = truncated ? items.slice(0, GRID_LIMIT) : items;

  return (
    <>
      <div className={Style.grid}>
        {visible.map((item) => (
          <button key={item.id} className={Style.card} onClick={() => setActive(item)}>
            <div
              className={Style.imageWrapper}
              style={item.photos[0] ? { backgroundImage: `url(${item.photos[0]})` } : undefined}
            >
              {!item.photos[0] && (
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

      {truncated && (
        <button className={Style.showMore} onClick={() => setShowAll(true)}>
          See more &rarr;
        </button>
      )}

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
