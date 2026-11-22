import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary("en");
  return (
    <div className="wrap page">
      <div className="empty">
        <h1>{t.notFoundTitle}</h1>
        <p>{t.notFoundText}</p>
        <Link className="btn btn-primary" href="/en">
          {t.home}
        </Link>
      </div>
    </div>
  );
}
