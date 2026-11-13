export type FormName = "booking" | "contact" | "book-preorder";

/**
 * Sends a form to NEXT_PUBLIC_FORM_ENDPOINT.
 *
 * In production that's the Google Apps Script web app (google-apps-script/Code.gs) that writes each
 * submission to a Google Sheet. Other JSON endpoints work too (e.g. Formspree);
 * NEXT_PUBLIC_FORM_ACCESS_KEY is added as `access_key` for services that need it (e.g. Web3Forms).
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

  // Apps Script web apps can't answer CORS preflight requests, so the JSON goes as text/plain
  // (a "simple" request, no preflight). The script parses it as JSON either way.
  const isAppsScript = endpoint.startsWith("https://script.google.com/");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: isAppsScript
      ? { "Content-Type": "text/plain;charset=utf-8" }
      : { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);

  // Apps Script always answers HTTP 200, so errors come back as { ok: false } in the body.
  const body: unknown = await res.json().catch(() => null);
  if (body && typeof body === "object" && (body as { ok?: unknown }).ok === false) {
    throw new Error(`Form submit rejected: ${(body as { error?: string }).error ?? "unknown error"}`);
  }
}
