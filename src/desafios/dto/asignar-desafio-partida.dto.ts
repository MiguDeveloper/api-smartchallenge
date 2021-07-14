import { Resultado } from './../interfaces/desafio.interface';
import { IsNotEmpty } from 'class-validator';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export class AsignarDesafioPartida {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Resultado[];
}
