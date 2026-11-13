"use client";

import { createContext, useCallback, useContext, useState } from "react";
import BookingModal from "./BookingModal";

type BookingContextValue = { openBooking: (serviceName: string) => void };

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export default function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [serviceName, setServiceName] = useState("Обрано послугу");

  const openBooking = useCallback((name: string) => {
    setServiceName(name);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal open={open} serviceName={serviceName} onClose={close} />
    </BookingContext.Provider>
  );
}
