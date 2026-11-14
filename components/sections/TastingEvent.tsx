import EventsSection from "@/components/events/EventsSection";
import { eventStartIso, events, kyivToday, upcomingEvents } from "@/data/events";

/** Event announcements from data/events.json — upcoming only, closest first. */
export default function TastingEvent() {
  const atBuild = upcomingEvents(events, kyivToday());

  // Structured data so search engines can show the events (past ones are ignored by them anyway).
  const jsonLd = atBuild.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: eventStartIso(e),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: e.city.replace(/^м\.\s*/, ""), addressCountry: "UA" } },
    description: e.description.join(" "),
    organizer: { "@type": "Person", name: "Don Sergio", url: "https://donsergio.org" },
    ...(e.ticketUrl ? { offers: { "@type": "Offer", url: e.ticketUrl, availability: "https://schema.org/InStock" } } : {}),
  }));

  return (
    <>
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <EventsSection all={events} atBuild={atBuild} />
    </>
  );
}
