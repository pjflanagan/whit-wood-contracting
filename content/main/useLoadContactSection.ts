import { useEffect, useState } from "react";
import { API } from "../../model";


export function useLoadContactSection() {
  const [contactSection, setContactSection] = useState<string | undefined>()

  useEffect(() => {
    async function loadContactSection(): Promise<void> {
      const newContactSection = await API.fetchContent('contact');
      setContactSection(newContactSection);
    }
    loadContactSection();
  }, []);

  return { contactSection };
}