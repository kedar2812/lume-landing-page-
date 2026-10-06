import { Hero } from "@/components/hero/Hero";
import { Island } from "@/components/island/Island";
import { SmoothScroll } from "@/motion/SmoothScroll";
import { Enquire } from "@/sections/Enquire";
import { Faq } from "@/sections/Faq";
import { Footer } from "@/sections/Footer";
import { Forgotten } from "@/sections/Forgotten";
import { Notes } from "@/sections/Notes";
import { Phone } from "@/sections/Phone";
import { ThemeProvider } from "@/theme/ThemeProvider";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "918805895066";

/**
 * lumecrm.in, small on purpose (owner's redesign, 2026-10-06): the hero, the problem in one line, LUME in five
 * plain notes over its own screens, the phone, four questions, the enquiry. Enough to want the demo; the demo
 * shows the rest.
 */
export default function Home() {
  return (
    <ThemeProvider>
      <a className="skip" href="#main">
        Skip to the page
      </a>
      <SmoothScroll />
      <Island whatsapp={WHATSAPP} />
      <main id="main">
        <Hero whatsapp={WHATSAPP} />
        <Forgotten />
        <Notes />
        <Phone />
        <Faq />
        <Enquire whatsapp={WHATSAPP} />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
