"use client";

import { contactServiceOptions } from "@/data/services";
import { contacts } from "@/data/contacts";
import { useFormSubmit } from "@/lib/useFormSubmit";
import FormError from "../FormError";
import FieldError from "../FieldError";
import Honeypot from "../Honeypot";

const inputClass =
  "w-full bg-gaudi-card border border-gold/40 text-neutral-100 px-4 py-3 text-sm gaudi-organic-radius-1 focus:outline-none focus:border-gold transition";
const labelClass = "block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-semibold";

const channels = [
  { icon: "fa-solid fa-phone", label: "Телефон / WhatsApp", ...contacts.phone, external: false, radius: 1 },
  { icon: "fa-brands fa-telegram", label: "Telegram", ...contacts.telegram, external: true, radius: 2 },
  { icon: "fa-solid fa-envelope", label: "E-mail", ...contacts.email, external: false, radius: 1 },
];

export default function Contacts() {
  const { status, onSubmit, errors, field } = useFormSubmit("contact");

  return (
    <section id="contacts" className="py-28 bg-gaudi-card/80 border-t border-gold/20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info */}
          <div className="lg:col-span-5 space-y-8 relative reveal-left">
            <div className="pt-4">
              <span className="text-gold text-xs uppercase tracking-widest font-bold block mb-2 font-cinzel">Зв&apos;язок</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100">Обговоримо вашу подію?</h2>
              <p className="text-neutral-300 font-light text-sm mt-3 leading-relaxed">
                Забронюйте дату заздалегідь. Можливий виїзд у будь-який куточок України.
              </p>
            </div>

            <div className="space-y-6 text-sm font-light">
              {channels.map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 gaudi-organic-radius-${c.radius} border border-gold/40 flex items-center justify-center text-gold text-lg bg-gaudi-dark`}
                  >
                    <i className={c.icon}></i>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-xs uppercase font-semibold">{c.label}</div>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener nofollow" } : {})}
                      className="text-neutral-200 hover:text-gold font-medium"
                    >
                      {c.text}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-gaudi-dark border-2 border-gold/40 gaudi-card-arch p-8 sm:p-10 shadow-2xl relative reveal-right">
            <h3 className="text-2xl font-serif font-bold text-neutral-100 mb-6 pt-4">Залишити запит на замовлення</h3>

            {status !== "success" ? (
              <form onSubmit={onSubmit} noValidate className="relative space-y-4">
                <Honeypot />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Ім&apos;я *</label>
                    <input id="contact-name" {...field("name", inputClass)} type="text" autoComplete="name" required placeholder="Ваше ім'я" />
                    <FieldError form="contact" field="name" error={errors.name} />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>Телефон *</label>
                    <input id="contact-phone" {...field("phone", inputClass)} type="tel" autoComplete="tel" required placeholder="+380..." />
                    <FieldError form="contact" field="phone" error={errors.phone} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-service" className={labelClass}>Обрати послугу *</label>
                  <select id="contact-service" {...field("service", inputClass)}>
                    {contactServiceOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <FieldError form="contact" field="service" error={errors.service} />
                </div>

                <div>
                  <label htmlFor="contact-date" className={labelClass}>Дата та місто події</label>
                  <input id="contact-date" {...field("dateCity", inputClass)} type="text" placeholder="Наприклад: 20 Листопада, Київ" />
                  <FieldError form="contact" field="dateCity" error={errors.dateCity} />
                </div>

                <div>
                  <label htmlFor="contact-comment" className={labelClass}>Коментар / Кількість гостей</label>
                  <textarea id="contact-comment" {...field("comment", inputClass)} rows={3} placeholder="Додаткові побажання..."></textarea>
                  <FieldError form="contact" field="comment" error={errors.comment} />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 gaudi-organic-radius-1 gaudi-gold-bg text-gaudi-dark font-extrabold uppercase text-xs tracking-widest hover:brightness-110 transition shadow-lg disabled:opacity-60"
                >
                  {status === "sending" ? "Надсилаємо..." : "Надіслати запит"}
                </button>
                {status === "error" && <FormError />}
              </form>
            ) : (
              <div role="status" className="mt-4 p-4 bg-gold/10 border border-gold text-gold text-sm font-light gaudi-organic-radius-1">
                <i className="fa-solid fa-circle-check mr-2"></i> Дякуємо! Я зв&apos;яжуся з вами найближчим часом.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
