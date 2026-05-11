import React from "react";
import Link from "next/link";
import { Section } from "./Section";
import { SocialIconRow } from "../social-icon-row";
import type { SocialLinks } from "../../model/site-config";

type FooterSectionProps = {
  socialLinks: SocialLinks;
};

export function FooterSection({ socialLinks }: FooterSectionProps) {
  return (
    <Section id="footer">
      <SocialIconRow socialLinks={socialLinks} />
      <p style={{ marginTop: "48px", fontSize: "14px", color: "#666" }}>
        Website by{" "}
        <Link href="https://pjflanagan.me" target="_blank" title="Peter Flanagan">
          Peter Flanagan
        </Link>
      </p>
    </Section>
  );
}
