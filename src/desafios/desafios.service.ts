import { AsignarDesafioPartida } from './dto/asignar-desafio-partida.dto';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { CategoriasService } from './../categorias/categorias.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { JogadoresService } from './../jogadores/jogadores.service';
import { Desafio, Partida } from './interfaces/desafio.interface';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class DesafiosService {
  private readonly logger = new Logger(DesafiosService.name);

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async getDesafios(): Promise<Desafio[]> {
    const desafios = await this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida');
    return desafios;
  }

  async getDesafiosByJogador(jogadorID: string): Promise<Desafio[]> {
    const jogador = await this.jogadoresService.getJogadorById(jogadorID);
    if (!jogador) {
      throw new NotFoundException(`Jogador con ID ${jogadorID} not found`);
    }

    const desafios = await this.desafioModel
      .find()
      .where('jogadores')
      .in([jogadorID])
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida');

    return desafios;
  }

  async crearDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const jogadores = await this.jogadoresService.getJogadores();

    criarDesafioDto.jogadores.forEach((jogadorDto) => {
      const jogadorFound = jogadores.find((jogador) => {
        return jogador._id == jogadorDto._id;
      });

      this.logger.log(`jogadorFound ${JSON.stringify(jogadorFound)}`);
      if (!jogadorFound) {
        throw new BadRequestException(
          `El Id ${jogadorDto._id} de jogador no existe`,
        );
      }
    });

    const { solicitante } = criarDesafioDto;

    // verificar que uno de los solicitantes sea uno de los retadores
    const solicitanteFound = criarDesafioDto.jogadores.find(
      (jogador) => jogador._id === solicitante._id,
    );

    if (!solicitanteFound) {
      throw new BadRequestException(
        'El solicitante debe ser un jugador de la partida',
      );
    }

    // encontrar la categoria en funcion del jugador solicitante
    const categoriaFound = await this.categoriaService.getCategoriaByJogadorId(
      solicitante._id,
    );

    if (!categoriaFound) {
      throw new BadRequestException(
        'El solicitante precisa estar registrado en una categoria',
      );
    }
    const desafio = new this.desafioModel(criarDesafioDto);
    desafio.categoria = categoriaFound.categoria;
    desafio.dataHoraSolicitacao = new Date();
    desafio.status = DesafioStatus.PENDENTE;

    this.logger.log(`desafio creado: ${JSON.stringify(desafio)}`);

    return await desafio.save();
  }

  async atualizarDesafio(
    desafioID: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<Desafio> {
    const desafioFound = await this.desafioModel.findById(desafioID);
    if (!desafioFound) {
      throw new NotFoundException(`Desafio ${desafioID} no esta registrado`);
    }

    if (atualizarDesafioDto.status) {
      desafioFound.dataHoraResposta = new Date();
    }

    desafioFound.status = atualizarDesafioDto?.status || desafioFound.status;
    desafioFound.dataHoraDesafio =
      atualizarDesafioDto?.dataHoraDesafio || desafioFound.dataHoraDesafio;
    this.logger.log(`desafioFound ${JSON.stringify(desafioFound)}`);
    const desafio = await this.desafioModel.findByIdAndUpdate(
      desafioID,
      desafioFound,
      { new: true },
    );

    return desafio;
  }

  async asignarDesafioPartida(
    desafioID: string,
    asignarDesafioPartidaDto: AsignarDesafioPartida,
  ): Promise<Desafio> {
    const desafioFound = await this.desafioModel.findById(desafioID);
    if (!desafioFound) {
      throw new NotFoundException(`Desafio ID ${desafioID} no existe`);
    }
    const defExiste = desafioFound.jogadores.find(
      (jogador) => jogador._id == asignarDesafioPartidaDto.def._id,
    );

    if (!defExiste) {
      throw new BadRequestException(
        'El jugador vencedor no es parte de este desafio',
      );
    }

    const partidaCreada = new this.partidaModel(asignarDesafioPartidaDto);
    partidaCreada.categoria = desafioFound.categoria;
    partidaCreada.jogadores = desafioFound.jogadores;
    const partida = await partidaCreada.save();

    desafioFound.status = DesafioStatus.REALIZADO;
    desafioFound.partida = partida._id;

    try {
      const desafio = await this.desafioModel.findByIdAndUpdate(
        desafioID,
        desafioFound,
        {
          new: true,
        },
      );

      return desafio;
    } catch (error) {
      await this.partidaModel.findByIdAndDelete({ _id: partida._id });
      throw new InternalServerErrorException();
    }
  }
}
