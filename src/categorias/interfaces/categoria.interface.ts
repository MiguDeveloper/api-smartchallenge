import { Jogador } from './../../jogadores/interfaces/jogador.interface';
export interface Evento {
  nome: string;
  operacao: string;
  valor: number;
}
export interface Categoria {
  categoria: string;
  descricao: string;
  eventos: Evento[];
  jogadores: Jogador[];
}
