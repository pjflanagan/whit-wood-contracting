import Link from 'next/link';
import { Section } from './Section';
import { SocialIconRow } from '../social-icon-row';
import type { SocialLinks } from '../../model/social-links';

type FooterSectionProps = {
  socialLinks: SocialLinks;
};

export function FooterSection({ socialLinks }: FooterSectionProps) {
  return (
    <Section id="footer">
      <SocialIconRow socialLinks={socialLinks} />
      <p style={{ margin: '64px 0 0 0', fontSize: '14px', color: '#0006', textAlign: 'right' }}>
        <a href="/admin" target="_blank">
          Admin
        </a>
        {' | '}
        Website by{' '}
        <Link href="https://pjflanagan.me" target="_blank" title="Peter Flanagan">
          Peter Flanagan
        </Link>
      </p>
    </Section>
  );
}
