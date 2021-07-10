import { ActualizarCategoriaDto } from './dto/actualizar-categoria.dto';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';
import {
  Body,
  Controller,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Get, Logger } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Put } from '@nestjs/common';

@Controller('api/v1/categorias')
export class CategoriasController {
  logger = new Logger(CategoriasController.name);

  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async getCategorias(@Res() res): Promise<Categoria[]> {
    const categorias = await this.categoriasService.getCategorias();
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      categorias,
    });
  }

  @Get('/idcategoria')
  async getCategoriaById(
    @Query('categoriaID') categoriaID: string,
    @Res() res,
  ): Promise<Categoria> {
    const categoria = await this.categoriasService.getCategoriaById(
      categoriaID,
    );
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      categoria,
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crearCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
    @Res() res,
  ): Promise<Categoria> {
    const categoria = await this.categoriasService.crearCategoria(
      criarCategoriaDto,
    );
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      categoria,
    });
  }

  @Put('/:categoriaID')
  @UsePipes(ValidationPipe)
  async updateCategoria(
    @Body() actualizarCategoriaDto: ActualizarCategoriaDto,
    @Param('categoriaID') categoriaID: string,
    @Res() res,
  ) {
    const categoria = await this.categoriasService.updateCategoria(
      actualizarCategoriaDto,
      categoriaID,
    );
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      categoria,
    });
  }

  @Post('/:categoria/jogadores/:jogadorID')
  async asignarCategoriaJogador(@Param() params, @Res() res) {
    this.logger.log(`params: ${JSON.stringify(params)}`);

    const { categoria, jogadorID } = params;
    const categoriaUpdate =
      await this.categoriasService.asignarCategoriaJogador(
        categoria,
        jogadorID,
      );

    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      categoria: categoriaUpdate,
    });
  }
}
