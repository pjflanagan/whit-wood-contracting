import { useState } from 'react';
import cx from 'classnames';
import type { Service } from '../../model/service';
import { Modal } from '../modal';
import Style from './ServicesList.module.scss';

const VISIBLE_LIMIT = 7;
const INDEX_WEIGHTS = [4, 2];

type ServicesListProps = {
  services: Service[];
};

export function ServicesList({ services }: ServicesListProps) {
  const [showAll, setShowAll] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);

  let squares = 0;
  const visible = showAll
    ? services
    : services.filter((_, i) => {
        const weight = INDEX_WEIGHTS[i] ?? 1;
        if (squares + weight <= VISIBLE_LIMIT) {
          squares += weight;
          return true;
        }
        return false;
      });

  const truncated = !showAll && visible.length < services.length;

  return (
    <>
      <div className={Style.gridWrapper}>
        <div className={Style.grid}>
          {visible.map((service, i) => {
            const image = service.images?.[0];
            return (
              <button
                key={service.title}
                className={cx(Style.card, {
                  [Style.primary]: i === 0,
                  [Style.secondary]: i === 1,
                })}
                onClick={() => setActiveService(service)}
              >
                {image && (
                  <div className={Style.cardBg} style={{ backgroundImage: `url(${image})` }} />
                )}
                <div className={cx(Style.cardContent, { [Style.cardOverlay]: !!image })}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </button>
            );
          })}
          {truncated && (
            <button
              className={cx(Style.card, Style.seeAll)}
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
