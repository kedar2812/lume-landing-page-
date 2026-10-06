import { readFileSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import s from "./doc.module.css";

/** A document page (privacy, terms): its text exactly as written in src/content, inside the site's own frame. */
export function DocPage({ file }: { file: "privacy" | "terms" }) {
  const html = readFileSync(path.join(process.cwd(), "src/content", `${file}.html`), "utf8");
  return (
    <>
      <header className={s.bar}>
        <div className={`wrap ${s.barIn}`}>
          <Link href="/" className={s.brand} aria-label="LUME home">
            <Image src="/lume-mark.png" alt="" width={26} height={26} priority />
            LUME
          </Link>
          <nav aria-label="Pages" className={s.links}>
            <Link href="/">Home</Link>
            <Link href="/privacy" aria-current={file === "privacy" ? "page" : undefined}>
              Privacy
            </Link>
            <Link href="/terms" aria-current={file === "terms" ? "page" : undefined}>
              Terms
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className={`wrap ${s.doc}`} dangerouslySetInnerHTML={{ __html: html }} />
      <footer className={s.foot}>
        <div className="wrap">© 2026 LUME · Kedar Uttam Gurav</div>
      </footer>
    </>
  );
}
