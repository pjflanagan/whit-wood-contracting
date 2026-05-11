import { useState } from 'react';
import type { Service } from '../../model/service';
import Style from './style.module.scss';

const VISIBLE_LIMIT = 5;

type ServicesListProps = {
  services: Service[];
};

export function ServicesList({ services }: ServicesListProps) {
  const [showAll, setShowAll] = useState(false);
  const truncated = !showAll && services.length > VISIBLE_LIMIT;
  const visible = truncated ? services.slice(0, VISIBLE_LIMIT - 1) : services;

  return (
    <div className={Style['grid']}>
      {visible.map((service) => {
        const isPriority = service.tier === 'priority';
        const classes = [Style['card'], isPriority && Style['priority']].filter(Boolean).join(' ');
        return (
          <div key={service.title} className={classes}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        );
      })}
      {truncated && (
        <button className={`${Style['card']} ${Style['see-all']}`} onClick={() => setShowAll(true)}>
          <span>See all</span>
        </button>
      )}
    </div>
  );
}
