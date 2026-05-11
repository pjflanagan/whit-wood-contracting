import { useEffect, useState } from 'react';
import Image from 'next/image';
import animateScrollTo from 'animated-scroll-to';
import Style from './StickyHeader.module.scss';
import type { PageSection } from '../../model/section';

type StickyHeaderProps = {
  businessName: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  sections: PageSection[];
};

export function StickyHeader({ businessName, triggerRef, sections }: StickyHeaderProps) {
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

  function handleNavClick(id: string) {
    const element = document.getElementById(id);
    if (element) {
      animateScrollTo(element, {
        minDuration: 400,
        // offset: -56 (header height)
        verticalOffset: -56,
      });
    }
  }

  return (
    <header className={`${Style.header} ${visible ? Style.visible : ''}`}>
      <div className={Style.brand}>
        <Image src="/img/logo/logo.png" alt={`${businessName} logo`} className={Style.logo} width={32} height={32} />
        <span className={Style.title}>{businessName}</span>
      </div>
      <nav className={Style.nav}>
        <ul className={Style.navList}>
          {sections
            .filter((s) => s.id !== 'contact')
            .map((section) => (
              <li key={section.id} className={Style.navItem}>
                <button className={Style.navLink} onClick={() => handleNavClick(section.id)}>
                  {section.title}
                </button>
              </li>
            ))}
          <li className={Style.navItem}>
            <button className={Style.navCta} onClick={() => handleNavClick('contact')}>
              Request a Quote
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
