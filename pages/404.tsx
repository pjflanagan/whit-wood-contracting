import React, { useEffect } from "react";

export default function Custom404() {
  useEffect(() => {
    window.location.replace(`/`);
  }, []);
  return null;
}
