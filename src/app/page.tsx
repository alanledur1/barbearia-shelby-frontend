import { HomePage } from "@/components/HomePage/HomePage";
import { HomePage_2 } from "@/components/HomePage_2/HomePage";
import { Contato } from "@/components/Contato/contato";
import SobreNos from "@/components/SobreNos/SobreNos";
import Servicos from "@/components/Servicos/servicos";
import Ticker from "@/components/Ticker/Ticker";
import Depoimentos from "@/components/Depoimentos/Depoimentos";
import { ProgressRail } from "@/components/ProgressRail/ProgressRail";

// Landing page única (ver referência Lovable / merge de design): Serviços deixou de ser
// rota separada (`/Servicos`) e virou seção âncora aqui mesmo, igual Sobre Nós/Contato já
// eram. `/Servicos` agora só redireciona pra cá (ver src/app/Servicos/page.tsx).
//
// Ordem validada na auditoria de conversão: Depoimentos (prova social) fica logo depois de
// Serviços — perto da oferta — e ANTES de Sobre Nós (institucional), não depois. CTA
// "Agendar horário" mantido só na hero e no footer — repetir em toda seção poluía a página.
export default function Home() {
  return (
    <div>
      <div data-progress-section><HomePage /></div>
      <div id="topo"/>
      <div data-progress-section><HomePage_2 /></div>
      <Ticker />
      <div id="servicos" data-progress-section>
        <Servicos />
      </div>
      <div data-progress-section><Depoimentos /></div>
      <div data-progress-section><SobreNos/></div>
      <div data-progress-section><Contato /></div>
      <ProgressRail />
    </div>
  );
}
