import { useState } from 'react';
import type { Service } from '../../model/service';
import { Modal } from '../modal';
import Style from './ServicesList.module.scss';

const VISIBLE_LIMIT = 7;

const TIER_ORDER = { primary: 0, secondary: 1, tertiary: 2 } as const;
const TIER_WEIGHT = { primary: 4, secondary: 2, tertiary: 1 } as const;

function resolvedTier(s: Service): 'primary' | 'secondary' | 'tertiary' {
  return s.tier === 'primary' || s.tier === 'secondary' ? s.tier : 'tertiary';
}

type ServicesListProps = {
  services: Service[];
};

export function ServicesList({ services }: ServicesListProps) {
  const [showAll, setShowAll] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);

  const sorted = [...services].sort(
    (a, b) => TIER_ORDER[resolvedTier(a)] - TIER_ORDER[resolvedTier(b)],
  );

  let squares = 0;
  const visible = showAll
    ? sorted
    : sorted.filter((s) => {
        const weight = TIER_WEIGHT[resolvedTier(s)];
        if (squares + weight <= VISIBLE_LIMIT) {
          squares += weight;
          return true;
        }
        return false;
      });

  const truncated = !showAll && visible.length < sorted.length;

  return (
    <>
      <div className={Style.gridWrapper}>
        <div className={Style.grid}>
          {visible.map((service) => {
            const image = service.images?.[0];
            const classes = [
              Style.card,
              service.tier === 'primary' && Style.primary,
              service.tier === 'secondary' && Style.secondary,
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={service.title}
                className={classes}
                style={image ? { backgroundImage: `url(${image})` } : undefined}
                onClick={() => setActiveService(service)}
              >
                <div className={[Style.cardContent, image && Style.cardOverlay].filter(Boolean).join(' ')}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </button>
            );
          })}
          {truncated && (
            <button
              className={`${Style.card} ${Style.seeAll}`}
              onClick={() => setShowAll(true)}
            >
              <span>See all &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {activeService && (
        <Modal
          title={activeService.title}
          description={activeService.description}
          images={activeService.images}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}
