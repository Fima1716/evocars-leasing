import { ToyotaBanner } from "@/components/hero/ToyotaBanner";
import { Header } from "@/components/layout/Header";

import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/preloader/Preloader";
import { CustomCursor } from "@/components/ux/CustomCursor";
import { UXScript } from "@/components/ux/UXScript";
import { ExitPopup } from "@/components/forms/ExitPopup";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { MobileNav } from "@/components/layout/MobileNav";
import { VisitTracker } from "@/components/ux/VisitTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Preloader />
      <ToyotaBanner />
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <MobileNav />
      <ExitPopup />
      <CustomCursor />
      <UXScript />
      <VisitTracker />
    </>
  );
}
