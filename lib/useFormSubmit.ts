"use client";

import { useCallback, useState } from "react";
import { submitForm, type FormName } from "./submitForm";
import { maxLengthOf, schemas, validateAll, validateField, type Errors } from "./validation";

export type SubmitStatus = "idle" | "sending" | "success" | "error";

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const INVALID_CLASS = "!border-red-400/80 focus:!border-red-400";

/** Id of a field's error message (for aria-describedby and tests). */
export const errorId = (form: FormName, field: string) => `${form}-${field}-error`;

/**
 * Wires a <form> to validation (lib/validation.ts) and submitForm().
 *
 * - `field(name, className)` → props for an input/textarea/select: name, maxLength, red border + aria when invalid,
 *   validation on blur, and live re-validation while typing once the field has shown an error.
 * - On submit everything is validated; if anything is wrong, nothing is sent and the first wrong field is focused.
 */
export function useFormSubmit(form: FormName, extra?: Record<string, string>) {
  const schema = schemas[form];
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => {
      if ((prev[name] ?? null) === error) return prev;
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  }, []);

  const field = (name: string, className = "") => ({
    name,
    maxLength: maxLengthOf(form, name),
    className: `${className} ${errors[name] ? INVALID_CLASS : ""}`.trim(),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? errorId(form, name) : undefined,
    onBlur: (e: React.FocusEvent<FieldElement>) => setFieldError(name, validateField(schema, name, e.currentTarget.value)),
    onChange: (e: React.ChangeEvent<FieldElement>) => {
      if (errors[name]) setFieldError(name, validateField(schema, name, e.currentTarget.value));
    },
  });

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

      const found = validateAll(schema, data);
      setErrors(found);
      if (Object.keys(found).length > 0) {
        // Focus the first wrong field in page order.
        const first = Array.from(el.elements).find((c) => (c as FieldElement).name in found) as FieldElement | undefined;
        first?.focus();
        return;
      }

      // Don't send empty optional fields.
      for (const k of Object.keys(data)) if (data[k] === "") delete data[k];

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
    [form, extra, schema],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setErrors({});
  }, []);

  return { status, onSubmit, reset, errors, field };
}
