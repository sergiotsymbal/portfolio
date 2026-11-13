"use client";

import { useCallback, useState } from "react";
import { submitForm, type FormName } from "./submitForm";

export type SubmitStatus = "idle" | "sending" | "success" | "error";

/** Wires a <form> to submitForm(): collects named fields, tracks status. */
export function useFormSubmit(form: FormName, extra?: Record<string, string>) {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const el = e.currentTarget;
      const data: Record<string, string> = { ...extra };
      new FormData(el).forEach((v, k) => {
        if (typeof v === "string") data[k] = v.trim();
      });
      // Honeypot: only sent when filled (i.e. by a bot), so the server can drop it.
      if (!data.website) delete data.website;
      setStatus("sending");
      try {
        await submitForm(form, data);
        el.reset();
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    },
    [form, extra],
  );

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, onSubmit, reset };
}
