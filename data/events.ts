/**
 * Events are edited in data/events.json (see README → "Events"). This module validates the file
 * (a typo fails `npm run build` with a clear message) and picks the upcoming ones.
 */
import raw from "./events.json";

export type EventItem = {
  title: string;
  /** YYYY-MM-DD (Kyiv). The event is shown until the end of this day. */
  date: string;
  /** HH:MM, Kyiv time (optional). */
  time?: string;
  city: string;
  venue: string;
  /** Paragraphs / lines of the description. */
  description: string[];
  /** Ticket page. Without it the button opens the booking popup. */
  ticketUrl?: string;
  ticketLabel?: string;
  /** Small text under the button, e.g. "Кількість місць обмежена". */
  note?: string;
};

function validate(data: unknown): EventItem[] {
  const list = (data as { events?: unknown })?.events;
  if (!Array.isArray(list)) throw new Error('events.json: expected { "events": [ ... ] }');
  return list.map((e: Record<string, unknown>, i) => {
    const fail = (msg: string): never => {
      throw new Error(`events.json → event #${i + 1}${typeof e?.title === "string" ? ` ("${e.title}")` : ""}: ${msg}`);
    };
    for (const f of ["title", "date", "city", "venue"]) {
      if (typeof e[f] !== "string" || !(e[f] as string).trim()) fail(`"${f}" is required (text)`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date as string) || Number.isNaN(Date.parse(e.date as string))) {
      fail('"date" must be a date like 2026-11-25');
    }
    if (e.time !== undefined && (typeof e.time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time))) {
      fail('"time" must look like 19:00');
    }
    const desc = typeof e.description === "string" ? [e.description] : e.description;
    if (!Array.isArray(desc) || desc.length === 0 || !desc.every((d) => typeof d === "string")) {
      fail('"description" must be text or a list of paragraphs');
    }
    if (e.ticketUrl !== undefined && (typeof e.ticketUrl !== "string" || !/^https?:\/\//.test(e.ticketUrl))) {
      fail('"ticketUrl" must start with https://');
    }
    for (const f of ["ticketLabel", "note"]) {
      if (e[f] !== undefined && typeof e[f] !== "string") fail(`"${f}" must be text`);
    }
    return { ...(e as EventItem), description: desc as string[] };
  });
}

export const events: EventItem[] = validate(raw);

/** Today's date in Kyiv as YYYY-MM-DD. */
export function kyivToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv" }).format(now);
}

/** Events on or after `today` (YYYY-MM-DD), closest first. */
export function upcomingEvents(all: EventItem[], today: string): EventItem[] {
  return all
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")));
}

const MONTHS = ["Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня", "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня"];

/** "25 Листопада 2026, 19:00" */
export function formatEventDate(e: Pick<EventItem, "date" | "time">): string {
  const [y, m, d] = e.date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}${e.time ? `, ${e.time}` : ""}`;
}

/** ISO start time with Kyiv's UTC offset on that date, for structured data. */
export function eventStartIso(e: Pick<EventItem, "date" | "time">): string {
  const local = `${e.date}T${e.time ?? "00:00"}:00`;
  const offset = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Kyiv", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${local}Z`))
    .find((p) => p.type === "timeZoneName")
    ?.value.replace("GMT", "") || "+02:00";
  return `${local}${offset}`;
}
