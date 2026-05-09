import { ReactNode } from "react"
import classNames from "classnames";
import Style from './style.module.scss';

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, id, className: classNameProp }: SectionProps) {
  const className = classNames(Style["section"], classNameProp);
  return (
    <div className={className} id={id}>
      {children}
    </div>
  )
}