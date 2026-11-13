export type FormName = "booking" | "contact" | "book-preorder";

/**
 * Sends a form to the endpoint configured in NEXT_PUBLIC_FORM_ENDPOINT (any service that accepts a JSON POST,
 * e.g. Formspree or Web3Forms). NEXT_PUBLIC_FORM_ACCESS_KEY is added as `access_key` for services that need it.
 *
 * Without an endpoint it runs in demo mode: logs the payload and resolves, so the UI can be tested end to end.
 */
export async function submitForm(form: FormName, data: Record<string, string>): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  const payload: Record<string, string> = { form, ...data };
  const accessKey = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY;
  if (accessKey) payload.access_key = accessKey;

  if (!endpoint) {
    console.info("[demo mode] form submitted (set NEXT_PUBLIC_FORM_ENDPOINT to send for real):", payload);
    await new Promise((r) => setTimeout(r, 400));
    return;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
}
