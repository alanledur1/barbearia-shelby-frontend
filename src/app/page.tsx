import { HomePage } from "@/components/HomePage/HomePage";
import { HomePage_2 } from "@/components/HomePage_2/HomePage";
import { Contato } from "@/components/Contato/contato";
import SobreNos from "@/components/SobreNos/SobreNos";

export default function Home() {
  return (
    <div>      
      <HomePage />
      <div id="topo"/>
      <HomePage_2 />
      <SobreNos/>
      <Contato />
    </div>
  );
}
