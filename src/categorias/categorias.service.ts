import { JogadoresService } from './../jogadores/jogadores.service';
import { ActualizarCategoriaDto } from './dto/actualizar-categoria.dto';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name);

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async getCategorias(): Promise<Categoria[]> {
    const categorias = await this.categoriaModel.find().populate('jogadores');
    return categorias;
  }

  async getCategoriaById(categoriaID: string): Promise<Categoria> {
    const categoriaFound = await this.categoriaModel.findById(categoriaID);
    if (!categoriaFound) {
      throw new NotFoundException(`Categoria con ID ${categoriaID} no existe`);
    }

    return categoriaFound;
  }

  async crearCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const categoriaFound = await this.categoriaModel.findOne({
      categoria: criarCategoriaDto.categoria,
    });

    if (categoriaFound) {
      throw new BadRequestException(
        `Categoria: ${criarCategoriaDto.categoria} ya existe`,
      );
    }

    const categoria = new this.categoriaModel(criarCategoriaDto);
    return await categoria.save();
  }

  async updateCategoria(
    actualizarCategoriaDto: ActualizarCategoriaDto,
    categoriaID: string,
  ): Promise<Categoria> {
    const [categoriaById, categoriaFound] = await Promise.all([
      this.categoriaModel.findById(categoriaID),
      this.categoriaModel.findOne({
        categoria: actualizarCategoriaDto.categoria,
      }),
    ]);

    if (!categoriaById) {
      throw new NotFoundException(`ID de categoria ${categoriaID} no existe`);
    }

    if (categoriaFound && categoriaFound._id != categoriaID) {
      throw new BadRequestException(
        `Categoria ${actualizarCategoriaDto.categoria} ya existe`,
      );
    }

    const categoriaUpdate = await this.categoriaModel.findByIdAndUpdate(
      categoriaID,
      actualizarCategoriaDto,
      { new: true },
    );

    return categoriaUpdate;
  }

  async asignarCategoriaJogador(
    categoria: string,
    jogadorID: string,
  ): Promise<Categoria> {
    const [categoriaFound, jogadorFound] = await Promise.all([
      this.categoriaModel.findOne({ categoria }),
      this.jogadoresService.getJogadorById(jogadorID),
    ]);

    if (!categoriaFound) {
      throw new NotFoundException(`Categoria ${categoria} no existe`);
    }
    if (!jogadorFound) {
      throw new NotFoundException(`ID Jogador ${jogadorID} no existe`);
    }

    const jogadorRegistradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in([jogadorID]);

    if (jogadorRegistradoCategoria.length > 0) {
      throw new BadRequestException(`Jogador ya esta en categoria`);
    }

    categoriaFound.jogadores.push(jogadorFound);
    const categoriaUpdate = await this.categoriaModel.findByIdAndUpdate(
      categoriaFound._id,
      categoriaFound,
    );

    return categoriaUpdate;
  }

  async getCategoriaByJogadorId(jogadorID: string): Promise<Categoria> {
    const jogador = await this.jogadoresService.getJogadorById(jogadorID);
    if (!jogador) {
      throw new BadRequestException(`jogador ID ${jogadorID} no existe`);
    }
    const categoria = await this.categoriaModel
      .findOne()
      .where('jogadores')
      .in([jogadorID]);

    return categoria;
  }
}
