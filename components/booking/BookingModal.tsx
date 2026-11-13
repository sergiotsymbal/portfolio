"use client";

import { useEffect, useMemo } from "react";
import { useFormSubmit } from "@/lib/useFormSubmit";
import FormError from "../FormError";
import FieldError from "../FieldError";
import Honeypot from "../Honeypot";
import { useEscape, useModalTransition } from "../useModalTransition";

type Props = { open: boolean; serviceName: string; onClose: () => void };

const inputClass =
  "w-full bg-gaudi-dark border border-gold/40 text-neutral-100 px-4 py-3 text-sm gaudi-organic-radius-1 focus:outline-none focus:border-gold";
const labelClass = "block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-semibold";

export default function BookingModal({ open, serviceName, onClose }: Props) {
  const { mounted, visible } = useModalTransition(open);
  const extra = useMemo(() => ({ service: serviceName }), [serviceName]);
  const { status, onSubmit, reset, errors, field } = useFormSubmit("booking", extra);

  useEscape(onClose);

  // Each opening starts with a fresh form.
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  // Close automatically after a successful submit, like the original.
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [status, onClose]);

  if (!mounted) return null;

  return (
    <div
      id="booking-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`fixed inset-0 z-50 bg-gaudi-dark/80 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300 ${visible ? "" : "opacity-0"}`}
    >
      <div
        className={`bg-gaudi-card border-2 border-gold gaudi-organic-radius-1 max-w-lg w-full p-6 sm:p-10 relative shadow-2xl overflow-hidden transform transition-transform duration-300 ${visible ? "scale-100" : "scale-95"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-neutral-400 hover:text-gold text-xl z-10"
          aria-label="Закрити"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 id="booking-modal-title" className="text-2xl font-serif font-bold text-neutral-100 mb-2 pr-6 break-words pt-4">
          Швидке замовлення
        </h3>
        <p className="text-xs text-gold font-cinzel uppercase tracking-widest mb-6 break-words">{serviceName}</p>

        {status !== "success" && (
          <form onSubmit={onSubmit} noValidate className="relative space-y-4">
            <Honeypot />
            <div>
              <label htmlFor="modal-name" className={labelClass}>Ваше ім&apos;я *</label>
              <input id="modal-name" {...field("name", inputClass)} type="text" autoComplete="name" required placeholder="Ім'я" />
              <FieldError form="booking" field="name" error={errors.name} />
            </div>
            <div>
              <label htmlFor="modal-contact" className={labelClass}>Телефон / Messenger *</label>
              <input id="modal-contact" {...field("contact", inputClass)} type="text" required placeholder="+380..." />
              <FieldError form="booking" field="contact" error={errors.contact} />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 gaudi-organic-radius-1 gaudi-gold-bg text-gaudi-dark font-extrabold uppercase text-xs tracking-widest hover:brightness-110 transition disabled:opacity-60"
            >
              {status === "sending" ? "Надсилаємо..." : "Підтвердити заявку"}
            </button>
            {status === "error" && <FormError />}
          </form>
        )}

        {status === "success" && (
          <div role="status" className="mt-4 p-3 bg-gold/10 border border-gold text-gold text-xs gaudi-organic-radius-1">
            <i className="fa-solid fa-circle-check mr-2"></i> Дякуємо! Заявку успішно надіслано.
          </div>
        )}
      </div>
    </div>
  );
}
