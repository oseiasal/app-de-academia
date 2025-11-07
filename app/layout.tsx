import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App de Academia",
  description: "Aplicativo para praticantes, personal trainers e academias",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">App de Academia</h1>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-800">Início</Link>
                <Link href="/exercises" className="text-gray-600 hover:text-gray-800">Exercícios</Link>
                <Link href="/templates" className="text-gray-600 hover:text-gray-800">Templates</Link>
                <Link href="/workouts" className="text-gray-600 hover:text-gray-800">Treinos</Link>
                <Link href="/calendar" className="text-gray-600 hover:text-gray-800">Calendário</Link>
                <Link href="/progress" className="text-gray-600 hover:text-gray-800">Progresso</Link>
                <Link href="/data" className="text-gray-600 hover:text-gray-800">Dados</Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <Script id="offline-setup" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(registration => console.log('SW registrado'))
                  .catch(error => console.error('Erro SW:', error));
              });
            }
            
            window.addEventListener('online', () => {
              console.log('Online - sincronizando...');
            });
            
            window.addEventListener('offline', () => {
              console.log('Offline - usando cache local');
            });
          `}
        </Script>
      </body>
    </html>
  );
}
