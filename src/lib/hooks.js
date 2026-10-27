import { useEffect, useState, useSyncExternalStore } from "react";
import { SITE } from "../data.js";

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const usePointerFine = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");

/* Current time where Divyanshu is, refreshed every 20 seconds. */
export function useLocalTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-IN", {
      timeZone: SITE.timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .format(new Date())
      .toUpperCase();
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}
