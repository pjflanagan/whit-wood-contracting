import { PostName } from "../pages/api/content";
import { Event, filterAndOrderDates } from "./event"


export const API = {
  fetchContent: async (section: PostName): Promise<string> => {
    const response = await fetch(`/api/content?section=${section}`, {
      method: 'GET',
    });
    const responseData = await response.json();
    return responseData;
  },

  fetchDisplayEvents: async (): Promise<Event[]> => {
    const response = await fetch('/api/events', {
      method: 'GET',
    });
    const responseData = await response.json();
    return filterAndOrderDates(responseData);
  }
}
