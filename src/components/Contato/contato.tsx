import React from 'react';
import './contato.scss'; // importe o arquivo SCSS
import { FaPhone } from "react-icons/fa6";
import { SlEnvolopeLetter } from "react-icons/sl";
import { TbMapShare } from "react-icons/tb";

export const Contato = () => {
  return (
    <div className='contato'>
      <div className='title'>CONTATO</div>
      <div className='container'>
        <div className="card">
          <h3><FaPhone className='icon'/> (51) 99817-7919</h3>
          <p>Atendimento rápido e sem enrolação. Agende agora pelo WhatsApp.</p>
        </div>
        <div className='card'>
          <h3><SlEnvolopeLetter className='icon'/> borgeselias876@gmail.com</h3>
          <p>Envie dúvidas, sugestões ou propostas comerciais.</p>
        </div>
        <div className='card'>
          <h3><TbMapShare className='icon'/> Rua Esperanto 203</h3>
          <p>Chega junto pra renovar o corte com estilo!</p>
        </div>
      </div>

      <div className='contato-conteudo'>
        <div className='bloco-titulo'>
          <h1>Localização</h1>
        </div>
        <div className='conteudo-horizontal'>
          <div className='localizacao'>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d364.66580337314895!2d-51.37228840664828!3d-29.594808713973556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1746580012590!5m2!1spt-BR!2sbr"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          <div className='formulario'>
            <form className='form' action="">
              <input type="text" placeholder='Nome' />
              <input type="text" placeholder='Email' />
              <textarea name="" id="" cols={30} rows={10} placeholder='Mensagem'></textarea>
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
