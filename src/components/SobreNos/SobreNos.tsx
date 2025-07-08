import React from 'react';
import './SobreNos.scss'; // importe o arquivo SCSS

export const SobreNos = () => {
  return (
    <div className="SobreNos"> 
        <div className='title'>SOBRE NÓS</div>
        <div className='container'>
            <div className="card">
                <h3>Nossa História</h3>
                <p>A Shelby Barbearia foi criada em 2021 para atender um público exigente, que busca estilo, conforto e aatitude.
                   Com um ambiente pensado para o homem moderno, unimos música, conversa boa e técnicas afiadas para entregar mais 
                   do que um corte: entregamos identidade. Aqui, cada cliente encontra seu próprio estilo - Shelby é mais que uma Barbearia
                   , é uma experiência.
                </p>
            </div>
            <div className='card'>
                <h3>Ambiente</h3>
                <p>A vibe tambem conta: ambiente climatizado, trilha sonora de respeito,café na recepção e aquele bate-papo que só 
                   uma barbearia de verdade pode oferecer. Seja sua primeira visita ou a décima, você sempre será recebido como parte da família Shelby.
                </p>
            </div>
            <div className='card'>
                <h3>Seu Tempo é valioso</h3>
                <p>Sabemos que tempo é um dos bens mais preciosos que você tem. Por isso, cada minuto aqui é planejado para entregar uma experiência de 
                  cuidado e estilo sem enrolação.
                </p>
             </div>
        </div>
        <div className='text-bottom'>Aguardamos você !!!</div>
    </div>
    
  );
};
 