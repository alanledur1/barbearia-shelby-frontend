// src/components/Agendamento/AgendamentoList.tsx

import React from 'react';

// Define o tipo para um único agendamento
type Agendamento = {
  id: number;
  cliente: string;
  data: string;
  hora: string;
};

// Define o tipo para as props que o componente recebe
type Props = {
  agendamentos: Agendamento[]; // Recebe um array de agendamentos
};

// Use "export default" se você importa sem chaves {}
// Use "export const AgendamentoList" se você importa com chaves {}
export default function AgendamentoList({ agendamentos }: Props) {

  // Checagem para quando a lista estiver vazia
  if (agendamentos.length === 0) {
    return <p>Nenhum horário marcado no momento.</p>;
  }

  return (
    <div>
      {/* Usamos .map() para percorrer o array e criar um item para cada agendamento */}
      {agendamentos.map(agendamento => (
        // A 'key' é essencial para o React identificar cada item da lista
        <div key={agendamento.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p><strong>Cliente:</strong> {agendamento.cliente}</p>
          <p><strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
          <p><strong>Hora:</strong> {agendamento.hora}</p>
        </div>
      ))}
    </div>
  );
}