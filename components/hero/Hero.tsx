import Style from './style.module.scss';

type HeroProps = {
  businessName: string;
  tagline: string;
  ctaLabel: string;
  ctaTarget: string;
};

export function Hero({ businessName, tagline, ctaLabel, ctaTarget }: HeroProps) {
  function handleCtaClick() {
    document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className={Style['hero']}>
      <div className={Style['overlay']}>
        <div className={Style['content']}>
          <img src="/img/logo/logo.png" alt={`${businessName} logo`} className={Style['logo']} />
          <h1>{businessName}</h1>
          <p className={Style['tagline']}>{tagline}</p>
          <button className={Style['cta']} onClick={handleCtaClick}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
