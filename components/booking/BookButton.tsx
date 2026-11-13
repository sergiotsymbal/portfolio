"use client";

import { useBooking } from "./BookingProvider";

type Props = { service: string; className?: string; id?: string; children: React.ReactNode };

export default function BookButton({ service, className, id, children }: Props) {
  const { openBooking } = useBooking();
  return (
    <button id={id} type="button" onClick={() => openBooking(service)} className={className}>
      {children}
    </button>
  );
}
