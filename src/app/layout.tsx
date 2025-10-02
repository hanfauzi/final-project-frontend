import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProviders";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import ClientProviders from "@/providers/ClientProviders";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Laundr",
  description: "Layanan laundry on-demand: cepat, bersih, terjamin.",
  keywords: ["laundry", "laundry online", "antar jemput", "laundry delivery", "Laundr"],
  openGraph: {
    title: "Laundr",
    description: "Layanan laundry on-demand: cepat, bersih, terjamin.",
    images: [
      {
        url: "https://laundr-project.vercel.app/logo-text-laundr.png",
        width: 1200,
        height: 630,
        alt: "Logo Laundr",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="font-sans">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <ClientProviders>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ClientProviders>
        </GoogleOAuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
