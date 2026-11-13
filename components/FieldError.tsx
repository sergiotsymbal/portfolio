import type { FormName } from "@/lib/submitForm";
import { errorId } from "@/lib/useFormSubmit";

/** Error message under a form field; linked to the input via aria-describedby. */
export default function FieldError({ form, field, error }: { form: FormName; field: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={errorId(form, field)} className="mt-1.5 text-xs text-red-300 flex items-start gap-1.5">
      <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true"></i>
      <span>{error}</span>
    </p>
  );
}
