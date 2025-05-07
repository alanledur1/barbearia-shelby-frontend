import React from 'react';
import './contato.scss'; // importe o arquivo SCSS


export const Contato = () => {
  return (
    <div className='contato'>
        <div className='title'>CONTATO</div>
        <div className='container'>
              <div className="card">
                  <h3>(51) 99817-7919</h3>
                  <p>lean phone ajsudi sahdasj adajsdas skask  skal kaks laslals  kasksks laksslad.</p>
              </div>
              <div className='card'>
                  <h3>mail@gmail.com</h3>
                  <p>lean phone ajsudi sahdasj adajsdas skask  skal kaks laslals  kasksks laksslad.</p>
              </div>
              <div className='card'>
                  <h3>Rua esperanto 203</h3>
                  <p>lean phone ajsudi sahdasj adajsdas skask  skal kaks laslals  kasksks laksslad.</p>
              </div>
        </div>
        <div className='localizacao'>
          <h1>Localização</h1>
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
  );
};
