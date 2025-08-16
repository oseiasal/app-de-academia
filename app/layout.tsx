import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

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
                <a href="/" className="text-gray-600 hover:text-gray-800">Início</a>
                <a href="/exercises" className="text-gray-600 hover:text-gray-800">Exercícios</a>
                <a href="/templates" className="text-gray-600 hover:text-gray-800">Templates</a>
                <a href="/workouts" className="text-gray-600 hover:text-gray-800">Treinos</a>
                <a href="/calendar" className="text-gray-600 hover:text-gray-800">Calendário</a>
                <a href="/progress" className="text-gray-600 hover:text-gray-800">Progresso</a>
                <a href="/data" className="text-gray-600 hover:text-gray-800">Dados</a>
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
