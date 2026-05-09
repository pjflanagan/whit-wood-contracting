import React from "react";
import Link from "next/link";
import { Section } from "./Section";

export function FooterSection() {
  return (
    <Section id="footer">
      <p>
        Website by{" "}
        <Link href="https://pjflanagan.me" target="_blank" title="Peter Flanagan">
          Peter Flanagan
        </Link>
      </p>
    </Section>
  );
}
