import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async getJogadores(): Promise<Jogador[]> {
    const jogadores = await this.jogadorModel.find();
    return jogadores;
  }

  async getJogadorById(jogadorID: string): Promise<Jogador> {
    const jogador = await this.jogadorModel.findById(jogadorID);
    return jogador;
  }

  async getJogadorByEmail(email: string): Promise<Jogador> {
    const jogador = await this.jogadorModel.findOne({ email });
    return jogador;
  }

  async criarAtualizarJugador(
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    const newJogador = new this.jogadorModel(criarJogadorDto);
    return await newJogador.save();
  }

  async updateJogador(
    jogadorID: string,
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    const jogadorCurr = await this.jogadorModel.findByIdAndUpdate(
      jogadorID,
      criarJogadorDto,
      { new: true },
    );

    return jogadorCurr;
  }

  async deleteJogador(jogadorID: string) {
    const deleteJogador = await this.jogadorModel.findByIdAndDelete(jogadorID);
    return deleteJogador;
  }
}
