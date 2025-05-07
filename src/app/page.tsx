import { HomePage } from "@/components/HomePage/HomePage";
import { HomePage_2 } from "@/components/HomePage_2/HomePage";
import { SobreNos } from "@/components/SobreNos/SobreNos";
import { Contato } from "@/components/Contato/contato";

export default function Home() {
  return (
    <div>
      <HomePage />
      <HomePage_2 />
      <SobreNos />
      <Contato />
    </div>
  );
}
