import { useEffect, useState } from "react";
import { Event, API } from "../../model";

export function useLoadEventsSection() {
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [eventsDefaultSection, setEventsDefaultSection] = useState<string | undefined>()

  useEffect(() => {
    async function loadEventsSection(): Promise<void> {
      const newEventsList = await API.fetchDisplayEvents();
      if (newEventsList.length > 0) {
        setEventsList(newEventsList);
      } else {
        const newEventsDefaultSection = await API.fetchContent('events');
        setEventsDefaultSection(newEventsDefaultSection);
      }
    }

    loadEventsSection();
  }, []);

  return { eventsList, eventsDefaultSection };
}