import React from 'react';
import './HomePage.scss'; // importe o arquivo SCSS
import { Span } from 'next/dist/trace';

export const HomePage_2 = () => {
  return (
    <div className="HomePage_2"> 
        <div className="title-1">
            Seja O <span className='red'>Protagonista</span> Da <br/> Sua Própria <span className='red'>História</span>.
            <br/> <br/>
            <div className='description'>Na barbearia Shelby, Cada Detalhe É Feito Para Você.</div>
        </div>
        <div className='title-2'>
            Na <span className='red'>Shelby</span>, Cada <span className='red'>Corte</span> É <br/> Mais Do Que Um <br/> <span className='red'>Simples</span> Serviço
            <br/> <br/>
            <div className='description'>A Arte De Cortar. A Precisão De Um Shelby.</div>
        </div>
    </div>
  );
};
