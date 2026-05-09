import type { PortfolioItem } from '../../model/portfolio-item';
import Style from './style.module.scss';

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className={Style['grid']}>
      {items.map((item) => (
        <div key={item.id} className={Style['card']}>
          <div className={Style['image-wrapper']}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} />
            ) : (
              <div className={Style['placeholder']}>
                <span>{item.category}</span>
              </div>
            )}
          </div>
          <div className={Style['info']}>
            <span className={Style['category']}>{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
