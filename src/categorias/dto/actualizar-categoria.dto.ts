import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Evento } from '../interfaces/categoria.interface';

export class ActualizarCategoriaDto {
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsOptional()
  descricao: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: Evento[];
}
