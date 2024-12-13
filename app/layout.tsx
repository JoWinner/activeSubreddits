import './globals.css';
import { siteConfig } from "config/site";
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  themeColor: "#FFF",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    }],
    creator: siteConfig.twitter.creator,
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          // defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        > */}
          {children}
          <Footer/>
          <script defer src="https://cloud.umami.is/script.js" data-website-id="f5011538-9f13-490d-828d-0b60eabc8e48"></script>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}