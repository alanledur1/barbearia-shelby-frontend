import Link from "next/link";
import { HomePage } from "@/components/HomePage/HomePage";
import { HomePage_2 } from "@/components/HomePage_2/HomePage";
import { Contato } from "@/components/Contato/contato";
import SobreNos from "@/components/SobreNos/SobreNos";
import Servicos from "@/components/Servicos/servicos";

// Landing page única (ver referência Lovable / merge de design): Serviços deixou de ser
// rota separada (`/Servicos`) e virou seção âncora aqui mesmo, igual Sobre Nós/Contato já
// eram. `/Servicos` agora só redireciona pra cá (ver src/app/Servicos/page.tsx).
export default function Home() {
  return (
    <div>
      <HomePage />
      <div id="topo"/>
      <HomePage_2 />
      <div id="servicos">
        <Servicos />
        <div className="flex justify-center bg-background pb-[70px]">
          <Link href="/agendamento" className="btn-accent">
            Ver disponibilidade
          </Link>
        </div>
      </div>
      <SobreNos/>
      <Contato />
    </div>
  );
}
