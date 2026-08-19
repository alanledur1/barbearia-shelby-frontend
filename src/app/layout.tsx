import { Bebas_Neue, Barlow } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { StaffSiteSidebarGate } from "@/components/navbar/StaffSiteSidebarGate";
import { Footer } from "@/components/footer/Footer";
import { ScrollToTopOnReload } from "@/components/ScrollToTopOnReload/ScrollToTopOnReload";
import { AuthProvider } from '@/context/AuthContext';

/* Dupla tipográfica do redesign (referência Lovable):
   - Bebas Neue: display condensado em caixa alta para H1/H2/H3 (peso único, 400).
   - Barlow: corpo, labels, botões e todo o texto de interface.
   As variáveis são consumidas em globals.css (`--font-display` / `--font-body`), o que faz
   as classes `font-display` e `font-body` do Tailwind funcionarem em qualquer componente. */
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
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
    // As classes `.variable` do next/font ficam no <html>, não no <body>: os tokens
    // --font-display/--font-body são declarados em :root (globals.css) e referenciam
    // var(--font-bebas)/var(--font-barlow). Se essas duas só existissem no <body>, a
    // declaração em :root seria inválida em tempo de computação e as duas variáveis
    // resolveriam para vazio — derrubando a tipografia do app inteiro.
    <html lang="pt-BR" className={`${bebasNeue.variable} ${barlow.variable}`}>
      <body className="antialiased">
        <ScrollToTopOnReload />
        <AuthProvider>
          <Navbar />
          <StaffSiteSidebarGate />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
