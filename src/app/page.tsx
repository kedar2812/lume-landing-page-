import { Chapter } from "@/components/Chapter";
import { SmoothScroll } from "@/motion/SmoothScroll";
import { Actions } from "@/sections/Actions";
import { Analytics } from "@/sections/Analytics";
import { CaughtEarly } from "@/sections/CaughtEarly";
import { Enquire } from "@/sections/Enquire";
import { Faq } from "@/sections/Faq";
import { FollowUp } from "@/sections/FollowUp";
import { Footer } from "@/sections/Footer";
import { LeadsDay } from "@/sections/LeadsDay";
import { OwnServer } from "@/sections/OwnServer";
import { Phone } from "@/sections/Phone";
import { Problems } from "@/sections/Problems";
import { RepDashboards } from "@/sections/RepDashboards";
import { Security } from "@/sections/Security";
import { Sources } from "@/sections/Sources";
import { ThemeProvider } from "@/theme/ThemeProvider";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "918805895066";

/**
 * lumecrm.in as one story (website spec §5.0): the problems a sales-led business lives with, LUME's answer to each
 * in the same order, how a day runs with it, what changes for the business, the questions, then the enquiry. The
 * Island and the hero (W3 Tasks 5–6) take the top once their designs are approved; a plain headline holds the
 * place until then.
 */
export default function Home() {
  return (
    <ThemeProvider>
      <a className="skip" href="#main">
        Skip to the page
      </a>
      <SmoothScroll />
      <main id="main">
        <header className="wrap" style={{ paddingBlock: "120px 40px" }}>
          <h1
            style={{
              fontSize: "var(--fs-hero)",
              letterSpacing: "var(--ls-hero)",
              lineHeight: 0.98,
              margin: 0,
            }}
          >
            Every lead, answered while it’s still warm.
          </h1>
        </header>

        <Problems />

        <Chapter
          id="meet"
          n={2}
          title="Meet LUME"
          line="Every problem above, answered — on one screen your team opens every morning."
        />
        <Sources />
        <FollowUp />
        <Actions />
        <RepDashboards />
        <Analytics />
        <CaughtEarly />
        <Security />

        <Chapter
          id="your-day"
          n={3}
          title="How it runs your day"
          line="From the moment an enquiry lands to the moment it’s won, at a desk or between visits."
        />
        <LeadsDay />
        <Phone />

        <Chapter
          id="results"
          n={4}
          title="What changes for your business"
          line="Every lead answered, every follow-up kept, every rep’s work in view — on a LUME that’s yours alone."
        />
        <OwnServer />

        <Faq />
        <Enquire whatsapp={WHATSAPP} />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
