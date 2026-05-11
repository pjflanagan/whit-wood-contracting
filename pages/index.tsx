import React, { useRef } from 'react';
import type { GetStaticProps } from 'next';
import { Hero } from '../components/hero';
import { StickyHeader } from '../components/sticky-header';
import { ServicesList } from '../components/services-list';
import { PortfolioGrid } from '../components/portfolio-grid';
import { Testimonials } from '../components/testimonials';
import { ContactForm } from '../components/contact-form';
import { Section, FooterSection } from '../components/section';
import { fetchSiteConfig, fetchServices, fetchPortfolio, fetchTestimonials, fetchAbout, fetchContact } from '../services/api';
import type { SiteConfig } from '../model/site-config';
import type { Service } from '../model/service';
import type { PortfolioItem } from '../model/portfolio-item';
import type { Testimonial } from '../model/testimonial';
import Style from './index.module.scss';

type HomePageProps = {
  siteConfig: SiteConfig;
  services: Service[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  aboutHtml: string;
  contactHtml: string;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [siteConfig, services, portfolio, testimonials, aboutHtml, contactHtml] = await Promise.all([
    fetchSiteConfig(),
    fetchServices(),
    fetchPortfolio(),
    fetchTestimonials(),
    fetchAbout(),
    fetchContact(),
  ]);
  return {
    props: { siteConfig, services, portfolio, testimonials, aboutHtml, contactHtml },
    revalidate: 3600,
  };
};

export default function Home({ siteConfig, services, portfolio, testimonials, aboutHtml, contactHtml }: HomePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  return (
    <>
      <StickyHeader businessName={siteConfig.businessName} triggerRef={heroRef} />
      <Hero
        ref={heroRef}
        businessName={siteConfig.businessName}
        tagline={siteConfig.tagline}
        ctaLabel={siteConfig.ctaLabel}
        ctaTarget={siteConfig.ctaTarget}
        heroImageUrl={siteConfig.heroImageUrl}
      />
      <main className={Style.page}>
        <div className={Style.layout}>
          <div className={Style.content}>
            <Section id="services">
              <h2>Our Services</h2>
              <ServicesList services={services} />
            </Section>
            <Section id="contact" className={Style.contactMobile}>
              <h2>Get in Touch</h2>
              <div dangerouslySetInnerHTML={{ __html: contactHtml }} />
              <ContactForm serviceNames={services.map((s) => s.title)} />
            </Section>
            <Section id="portfolio">
              <h2>Our Work</h2>
              <PortfolioGrid items={portfolio} />
            </Section>
            <Section id="testimonials">
              <h2>What Our Clients Say</h2>
              <Testimonials testimonials={testimonials} />
            </Section>
            <Section id="about">
              <h2>About Us</h2>
              <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
            </Section>
            <FooterSection socialLinks={siteConfig.socialLinks} />
          </div>
          <aside className={Style.sidebar}>
            <div className={Style.sidebarInner}>
              <h2 className={Style.sidebarHeading}>Get a Free Estimate</h2>
              <div dangerouslySetInnerHTML={{ __html: contactHtml }} />
              <ContactForm singleColumn serviceNames={services.map((s) => s.title)} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
