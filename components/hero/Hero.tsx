import React from 'react';
import Image from 'next/image';
import Style from './Hero.module.scss';

type HeroProps = {
  businessName: string;
  tagline: string;
  ctaLabel: string;
  ctaTarget: string;
  heroImageUrl?: string;
};

export function Hero({ businessName, tagline, ctaLabel, ctaTarget, heroImageUrl }: HeroProps) {
  function handleCtaClick() {
    document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' });
  }

  const heroStyle = heroImageUrl
    ? ({ '--hero-bg-image': `url(${heroImageUrl})` } as React.CSSProperties)
    : undefined;

  return (
    <section className={Style.hero} style={heroStyle}>
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
}
