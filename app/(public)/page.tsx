import { HeroSection } from "@/components/hero/HeroSection";
import { Reel } from "@/components/hero/Reel";
import { BrandsMarquee } from "@/components/hero/BrandsMarquee";
import { UtpSection } from "@/components/utp/UtpSection";
import { TestDrivePromo } from "@/components/testdrive/TestDrivePromo";
import { Segments } from "@/components/segments/Segments";
import { CatalogMini } from "@/components/car/CatalogMini";
import { LeasingCalculator } from "@/components/calculator/LeasingCalculator";
import { FAQ } from "@/components/faq/FAQ";
import { Blog } from "@/components/blog/Blog";
import { ReferralPromo } from "@/components/referral/ReferralPromo";
import { CTASection } from "@/components/forms/CTASection";
import { SearchBar } from "@/components/hero/SearchBar";
export default function HomePage() {
  return (
    <>
      <SearchBar />
      <HeroSection />
      <Reel />
      <BrandsMarquee />
      <UtpSection />
      <CatalogMini />
      <LeasingCalculator />
      <TestDrivePromo />
      <Segments />
      <ReferralPromo />
      <FAQ />
      <Blog />
      <CTASection />
    </>
  );
}
