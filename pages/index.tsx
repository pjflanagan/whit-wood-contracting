import React from 'react';
import type { GetStaticProps } from 'next';
import { Hero } from '../components/hero';
import { ServicesList } from '../components/services-list';
import { PortfolioGrid } from '../components/portfolio-grid';
import { Testimonials } from '../components/testimonials';
import { ContactForm } from '../components/contact-form';
import { Section, FooterSection } from '../components/section';
import { TITLE, SUBTITLE } from '../content/metadata';
import { fetchServices, fetchPortfolio, fetchTestimonials, fetchAbout, fetchContact } from '../model/notion';
import type { Service } from '../model/service';
import type { PortfolioItem } from '../model/portfolio-item';
import type { Testimonial } from '../model/testimonial';
import Style from './index.module.scss';

type HomePageProps = {
  services: Service[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  aboutHtml: string;
  contactHtml: string;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [services, portfolio, testimonials, aboutHtml, contactHtml] = await Promise.all([
    fetchServices(),
    fetchPortfolio(),
    fetchTestimonials(),
    fetchAbout(),
    fetchContact(),
  ]);
  return {
    props: { services, portfolio, testimonials, aboutHtml, contactHtml },
    revalidate: 3600,
  };
};

export default function Home({ services, portfolio, testimonials, aboutHtml, contactHtml }: HomePageProps) {
  return (
    <>
      <Hero businessName={TITLE} tagline={SUBTITLE} ctaLabel="Get a Free Quote" ctaTarget="contact" />
      <main className={Style['page']}>
        <Section id="services">
          <h2>Our Services</h2>
          <ServicesList services={services} />
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
        <Section id="contact">
          <h2>Get in Touch</h2>
          <div dangerouslySetInnerHTML={{ __html: contactHtml }} />
          <ContactForm />
        </Section>
        <FooterSection />
      </main>
    </>
  );
}
