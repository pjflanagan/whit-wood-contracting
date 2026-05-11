import { FaFacebook, FaInstagram, FaGoogle, FaYelp } from 'react-icons/fa';
import { SiHouzz } from 'react-icons/si';
import type { SocialLinks } from '../../model/social-links';
import Style from './SocialIconRow.module.scss';

type SocialIconRowProps = {
  socialLinks: SocialLinks;
};

type SocialEntry = {
  url: string;
  icon: JSX.Element;
  label: string;
};

export function SocialIconRow({ socialLinks }: SocialIconRowProps) {
  const entries: SocialEntry[] = (
    [
      { url: socialLinks.facebookUrl, icon: <FaFacebook />, label: 'Facebook' },
      { url: socialLinks.instagramUrl, icon: <FaInstagram />, label: 'Instagram' },
      { url: socialLinks.houzzUrl, icon: <SiHouzz />, label: 'Houzz' },
      { url: socialLinks.yelpUrl, icon: <FaYelp />, label: 'Yelp' },
      { url: socialLinks.googleUrl, icon: <FaGoogle />, label: 'Google' },
    ] as Array<{ url: string | undefined; icon: JSX.Element; label: string }>
  ).filter((e): e is SocialEntry => !!e.url);

  if (entries.length === 0) return null;

  return (
    <div className={Style.socialIconRow}>
      {entries.map(({ url, icon, label }) => (
        <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className={Style.icon}>
          {icon}
        </a>
      ))}
    </div>
  );
}
