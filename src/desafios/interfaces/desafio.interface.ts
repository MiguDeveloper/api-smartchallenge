import { Jogador } from './../../jogadores/interfaces/jogador.interface';

import { DesafioStatus } from './desafio-status.enum';

export interface Desafio {
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  categoria: string;
  jogadores: Jogador[];
  partida: Partida;
}

export interface Partida {
  categoria: string;
  jogadores: Jogador[];
  def: Jogador;
  resultado: Resultado[];
}

export interface Resultado {
  set: string;
}
