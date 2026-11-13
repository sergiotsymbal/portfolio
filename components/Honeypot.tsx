/**
 * Spam trap: invisible to people (and screen readers), but bots that fill every field fill this too.
 * The server silently drops submissions where it isn't empty.
 */
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
