import {
  EventsList,
  Section,
} from "../../components";
import { HomePageProps } from '../../pages/index';
import { useLoadContactSection } from "./useLoadContactSection";
import { useLoadEventsSection } from "./useLoadEventsSection";

import Style from "./style.module.scss";

export default function SidebarBelowTheFold({ aboutSection }: HomePageProps) {

  const { eventsList, eventsDefaultSection } = useLoadEventsSection();
  const { contactSection } = useLoadContactSection();

  return (
    <>
      <Section className={Style["events"]} id="events">
        <h2>Events</h2>
        {eventsList.length === 0 && eventsDefaultSection && (
          <div dangerouslySetInnerHTML={{ __html: eventsDefaultSection || '' }} />
        )}
        <EventsList eventsList={eventsList} />
      </Section>
      <Section className={Style["about"]} id="about">
        <h2>About</h2>
        <div dangerouslySetInnerHTML={{ __html: aboutSection || '' }} />
      </Section>
      <Section className={Style["contact"]} id="contact">
        <h2>Contact</h2>
        <div dangerouslySetInnerHTML={{ __html: contactSection || '' }} />
      </Section>
    </>
  );
}
