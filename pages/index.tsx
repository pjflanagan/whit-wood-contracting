import { useRef } from 'react';
import type { GetStaticProps } from 'next';
import { Hero } from '../components/hero';
import { StickyHeader } from '../components/sticky-header';
import { ServicesList } from '../components/services-list';
import { PortfolioGrid } from '../components/portfolio-grid';
import { Testimonials } from '../components/testimonials';
import { ContactForm } from '../components/contact-form';
import { Section, FooterSection } from '../components/section';
import { fetchSiteConfig, fetchSiteImages, fetchSocialLinks, fetchServices, fetchPortfolio, fetchTestimonials, fetchAbout, fetchSections } from '../services/api';
import type { SiteConfig } from '../model/site-config';
import type { SiteImages } from '../model/site-images';
import type { SocialLinks } from '../model/social-links';
import type { Service } from '../model/service';
import type { PortfolioItem } from '../model/portfolio-item';
import type { Testimonial } from '../model/testimonial';
import type { PageSection } from '../model/section';
import Style from './index.module.scss';

type HomePageProps = {
  siteConfig: SiteConfig;
  siteImages: SiteImages;
  socialLinks: SocialLinks;
  services: Service[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  sections: PageSection[];
  aboutHtml: string;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [siteConfig, siteImages, socialLinks, services, portfolio, testimonials, sections, aboutHtml] = await Promise.all([
    fetchSiteConfig(),
    fetchSiteImages(),
    fetchSocialLinks(),
    fetchServices(),
    fetchPortfolio(),
    fetchTestimonials(),
    fetchSections(),
    fetchAbout(),
  ]);
  return {
    props: { siteConfig, siteImages, socialLinks, services, portfolio, testimonials, sections, aboutHtml },
    revalidate: 3600,
  };
};

function ContactInfo({ phone, email }: { phone: string; email: string }) {
  return (
    <>
      {phone && <p><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></p>}
      {email && <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>}
    </>
  );
}

function renderSectionContent(id: string, title: string, description: string, props: Omit<HomePageProps, 'siteImages' | 'socialLinks' | 'sections'>) {
  const { siteConfig, services, portfolio, testimonials, aboutHtml } = props;
  const desc = description ? <p>{description}</p> : null;
  switch (id) {
    case 'services':
      return (
        <Section key={id} id={id}>
          <h2>{title}</h2>
          {desc}
          <ServicesList services={services} />
        </Section>
      );
    case 'contact':
      return (
        <Section key={id} id={id} className={Style.contactMobile}>
          <h2>{title}</h2>
          {desc}
          <ContactInfo phone={siteConfig.phone} email={siteConfig.email} />
          <ContactForm serviceNames={services.map((s) => s.title)} />
        </Section>
      );
    case 'portfolio':
      return (
        <Section key={id} id={id}>
          <h2>{title}</h2>
          {desc}
          <PortfolioGrid items={portfolio} />
        </Section>
      );
    case 'testimonials':
      return (
        <Section key={id} id={id}>
          <h2>{title}</h2>
          {desc}
          <Testimonials testimonials={testimonials} />
        </Section>
      );
    case 'about':
      return (
        <Section key={id} id={id}>
          <h2>{title}</h2>
          {desc}
          <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
        </Section>
      );
    default:
      return null;
  }
}

export default function Home({ siteConfig, siteImages, socialLinks, services, portfolio, testimonials, sections, aboutHtml }: HomePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const contentProps = { siteConfig, services, portfolio, testimonials, aboutHtml };
  return (
    <>
      <StickyHeader businessName={siteConfig.businessName} triggerRef={heroRef} />
      <Hero
        ref={heroRef}
        businessName={siteConfig.businessName}
        tagline={siteConfig.tagline}
        ctaLabel={siteConfig.ctaLabel}
        heroImageUrl={siteImages.heroImageUrl}
      />
      <main className={Style.page}>
        <div className={Style.layout}>
          <div className={Style.content}>
            {sections.map(({ id, title, description }) => renderSectionContent(id, title, description, contentProps))}
            <FooterSection socialLinks={socialLinks} />
          </div>
          <aside className={Style.sidebar}>
            <div className={Style.sidebarInner}>
              <h2 className={Style.sidebarHeading}>Get a Free Estimate</h2>
              <ContactInfo phone={siteConfig.phone} email={siteConfig.email} />
              <ContactForm singleColumn serviceNames={services.map((s) => s.title)} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
