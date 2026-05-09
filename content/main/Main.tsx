import { lazy, Suspense } from "react";
import {
  SocialIconRow,
  FooterSection,
  Section,
} from "../../components";
import {
  ScrollDownButton,
} from '../../components/scroll-down-button';
import { HomePageProps } from '../../pages/index';
import { SUBTITLE, TITLE_FULL } from "../metadata";
const SidebarBelowTheFold = lazy(() => import("./SidebarBelowTheFold"));

import Style from "./style.module.scss";

export function Main(props: HomePageProps) {

  return (
    <>
      <Section className={Style["intro"]} id="intro">
        <div className={Style["intro-content"]}>
          <div className={Style["logo-holder"]}>
            <img src="/img/logo/logo.png" width="84" alt={`${TITLE_FULL} Logo`} />
          </div>
          <h1>{TITLE_FULL}</h1>
          <h4>{SUBTITLE}</h4>
          <SocialIconRow />
        </div>
        <div className={Style["scroll-down-button-holder"]}>
          <ScrollDownButton color="dark" sourceId="sidebar" targetId="events" />
        </div>
      </Section>
      <hr className={Style["intro-divider"]} />
      <Suspense fallback={<div>Loading...</div>}>
        <SidebarBelowTheFold {...props} />
      </Suspense>
      <hr />
      <FooterSection />
    </>
  );
}
