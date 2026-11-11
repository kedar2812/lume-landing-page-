import { SmoothScroll } from "@/motion/SmoothScroll";
import { Ai } from "@/site/Ai";
import { Calendar } from "@/site/Calendar";
import { Cost } from "@/site/Cost";
import { Faq, Footer, Own } from "@/site/Closing";
import { Enquire } from "@/site/Enquire";
import { Hero } from "@/site/Hero";
import { Nav } from "@/site/Nav";
import { Problem } from "@/site/Problem";
import { Product } from "@/site/Product";
import { Whatsapp } from "@/site/Whatsapp";
import { ThemeProvider } from "@/theme/ThemeProvider";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "919764256655";

/**
 * lumecrm.in, rebuilt from nothing (owner, 2026-11-11). The page argues in order: the problem, live (leads waiting
 * and cooling in the hero, gathered into LUME by the scroll); one lead's ordinary day, lost; the visitor's own sum;
 * then what fixes it (LUME AI, WhatsApp Business inside LUME, calls booked on the calendar), the rest of the
 * product in its own captures, where the data lives, the questions, and the demo in five tapped steps.
 */
export default function Home() {
  return (
    <ThemeProvider>
      <a className="skip" href="#main">
        Skip to the page
      </a>
      <SmoothScroll />
      <div className="site">
        <Nav />
        <main id="main">
          <Hero />
          <Problem />
          <Cost />
          <Ai />
          <Whatsapp />
          <Calendar />
          <Product />
          <Own />
          <Faq />
          <Enquire whatsapp={WHATSAPP} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
