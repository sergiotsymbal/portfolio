import { contacts } from "@/data/contacts";

export default function FormError() {
  return (
    <div role="alert" className="mt-4 p-3 bg-red-950/40 border border-red-500/60 text-red-300 text-xs gaudi-organic-radius-1">
      <i className="fa-solid fa-triangle-exclamation mr-2"></i> Не вдалося надіслати заявку. Спробуйте ще раз або
      зателефонуйте: <a href={contacts.phone.href} className="underline">{contacts.phone.text}</a>
    </div>
  );
}
