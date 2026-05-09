import type { Service } from '../../model/service';
import Style from './style.module.scss';

type ServicesListProps = {
  services: Service[];
};

export function ServicesList({ services }: ServicesListProps) {
  return (
    <div className={Style['grid']}>
      {services.map((service) => (
        <div key={service.id} className={Style['card']}>
          <span className={Style['icon']} aria-hidden="true">{service.icon}</span>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
