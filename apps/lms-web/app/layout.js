import { DM_Sans, Geist_Mono, Space_Grotesk } from "next/font/google";
import { TooltipProvider } from "@flcn-lms/ui/components/tooltip";
import { cn } from "@flcn-lms/ui/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import "swiper/css";
import "@flcn-lms/ui/globals.css";
const spaceGroteskHeading = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-heading",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});
export const metadata = {
    title: "FLCN LMS",
    description: "Learn from the best instructors",
};
function RootLayout({ children }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", fontMono.variable, "font-sans", dmSans.variable, spaceGroteskHeading.variable)} style={{
            // Font Config
            "--font-sans": `${dmSans.style.fontFamily}`,
            "--font-heading": `${spaceGroteskHeading.style.fontFamily}`,
            "--font-mono": `${fontMono.style.fontFamily}`,
        }}>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>);
}
export default RootLayout;
