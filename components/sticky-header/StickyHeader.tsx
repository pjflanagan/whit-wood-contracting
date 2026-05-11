import { useEffect, useState } from 'react';
import Image from 'next/image';
import Style from './StickyHeader.module.scss';

type StickyHeaderProps = {
  businessName: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

export function StickyHeader({ businessName, triggerRef }: StickyHeaderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (!triggerRef.current) return;
      const bottom = triggerRef.current.getBoundingClientRect().bottom;
      setVisible(bottom <= 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [triggerRef]);

  return (
    <header className={`${Style.header} ${visible ? Style.visible : ''}`}>
      <div className={Style.brand}>
        <Image src="/img/logo/logo.png" alt={`${businessName} logo`} className={Style.logo} width={32} height={32} />
        <span className={Style.title}>{businessName}</span>
      </div>
    </header>
  );
}
