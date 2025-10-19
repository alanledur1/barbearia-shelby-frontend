import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Poppins } from 'next/font/google';
import { ScrollToTopOnReload } from "@/components/ScrollToTopOnReload/ScrollToTopOnReload";
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:{
  default: 'BarbeBarbearia Shelby - Agende seu Corte de Cabelo e Barba',
  template: '%s | Barbearia Shelby',
},
description: 'Barbearia Shelby: agendamento online de cortes de cabelo e barba. Ambiente moderno, profissionais qualificados e o estilo que você procura. Agende seu horário!',
  keywords: ['barbearia', 'agendamento online', 'corte de cabelo masculino', 'barba', 'barbeiro', 'shelby'],
  authors: [{ name: 'Seu Nome ou Nome da Empresa' }],
  // Open Graph para compartilhamento em redes sociais
  openGraph: {
    title: 'Barbearia Shelby - Agende seu Horário',
    description: 'Estilo, conforto e atitude. Agende seu corte de cabelo e barba na Barbearia Shelby.',
    url: 'https://seusite.com.br', // Substitua pela URL real do seu site
    siteName: 'Barbearia Shelby',
    images: [
      {
        url: 'https://seusite.com.br/og-image.jpg', // Crie uma imagem de preview (ex: 1200x630px)
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.className}`}>
        <ScrollToTopOnReload />
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
