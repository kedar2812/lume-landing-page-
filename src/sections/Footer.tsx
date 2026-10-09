import Image from "next/image";
import Link from "next/link";
import s from "./footer.module.css";

/** The foot of every page (website spec §5, item 16): the founder, Google's Limited Use statement, the documents. */
export function Footer() {
  return (
    <footer className={s.foot}>
      <div className={`wrap ${s.in}`}>
        <Link href="/" className={s.brand} aria-label="LUME home">
          <Image src="/lume-mark.png" alt="" width={22} height={22} />
          LUME
        </Link>
        <p className={s.google}>
          Continue with Google is optional. It lets you import the Google Sheets you pick in Google’s own
          picker, and shows your meetings with leads from calendars you own, read-only; LUME never changes an
          event. See the <Link href="/privacy">privacy policy</Link> for exactly what LUME reads. LUME’s use
          of information received from Google APIs adheres to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
        <nav aria-label="Documents" className={s.links}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <p className={s.copy}>© 2026 LUME · Kedar Uttam Gurav</p>
      </div>
    </footer>
  );
}
