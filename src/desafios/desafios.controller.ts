import { AsignarDesafioPartida } from './dto/asignar-desafio-partida.dto';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { DesafiosService } from './desafios.service';
import { ValidacaoParametrosPipe } from './../common/pipes/validacao-parametros.pipe';
import {
  Body,
  Post,
  UsePipes,
  Res,
  Query,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Get, Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Get()
  async getDesafios(@Res() res) {
    const desafios = await this.desafiosService.getDesafios();
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      desafios,
    });
  }

  @Get('/jogador')
  async getDesafioByJogador(
    @Query('jogadorID', ValidacaoParametrosPipe) jogadorID: string,
    @Res() res,
  ) {
    const desafios = await this.desafiosService.getDesafiosByJogador(jogadorID);
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      desafios,
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crearDesafio(@Body() criarDesafioDto: CriarDesafioDto, @Res() res) {
    const desafio = await this.desafiosService.crearDesafio(criarDesafioDto);
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      desafio,
    });
  }

  @Put('/:desafioID')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('desafioID', ValidacaoParametrosPipe) desafioID: string,
    @Body() atualizarDesafioDto: AtualizarDesafioDto,
    @Res() res,
  ) {
    const desafio = await this.desafiosService.atualizarDesafio(
      desafioID,
      atualizarDesafioDto,
    );

    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      desafio,
    });
  }

  @Post('/:desafioID/partida/')
  @UsePipes(ValidationPipe)
  async asignarDesafioPartida(
    @Param('desafioID', ValidacaoParametrosPipe) desafioID: string,
    @Body() asignarDesafioPartida: AsignarDesafioPartida,
    @Res() res,
  ) {
    const desafio = await this.desafiosService.asignarDesafioPartida(
      desafioID,
      asignarDesafioPartida,
    );

    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      desafio,
    });
  }
}
