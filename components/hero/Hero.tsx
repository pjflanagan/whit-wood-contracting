import React from 'react';
import Image from 'next/image';
import Style from './Hero.module.scss';

type HeroProps = {
  businessName: string;
  tagline: string;
  ctaLabel: string;
  heroImageUrl?: string;
};

export const Hero = React.forwardRef<HTMLElement, HeroProps>(function Hero(
  { businessName, tagline, ctaLabel, heroImageUrl },
  ref
) {
  function handleCtaClick() {
    const target = document.getElementById('contact');
    if (target && target.offsetParent !== null) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      // On desktop the mobile contact section is hidden; scroll past the hero so
      // the sticky sidebar form comes into full view
      document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const heroStyle = heroImageUrl
    ? ({ '--hero-bg-image': `url(${heroImageUrl})` } as React.CSSProperties)
    : undefined;

  return (
    <section ref={ref} className={Style.hero} style={heroStyle}>
      <div className={Style.overlay}>
        <div className={Style.content}>
          <Image src="/img/logo/logo.png" alt={`${businessName} logo`} className={Style.logo} width={120} height={120} />
          <h1>{businessName}</h1>
          <p className={Style.tagline}>{tagline}</p>
          <button className={Style.cta} onClick={handleCtaClick}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
});
