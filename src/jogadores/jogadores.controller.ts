import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';
import {
  HttpStatus,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Query, Put } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Body, Controller, Post, Get, Res } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Get('')
  async getJogadores(@Res() res) {
    const jogadores = await this.jogadoresService.getJogadores();
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      jogadores,
    });
  }

  @Get('/byid')
  async getJogadorById(
    @Query('jogadorID', JogadoresValidacaoParametrosPipe) jogadorID: string,
    @Res() res,
  ) {
    const jogador = await this.jogadoresService.getJogadorById(jogadorID);
    if (!jogador) {
      throw new NotFoundException('jogador not found');
    }

    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      jogador,
    });
  }

  @Get('/byemail')
  async getJogadorByEmail(
    @Query('email', JogadoresValidacaoParametrosPipe) email: string,
    @Res() res,
  ) {
    const jogador = await this.jogadoresService.getJogadorByEmail(email);
    if (!jogador) {
      throw new NotFoundException('jogador not found');
    }
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      jogador,
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJugador(@Body() criarJogadorDto: CriarJogadorDto, @Res() res) {
    const jogador = await this.jogadoresService.criarJugador(criarJogadorDto);
    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      jogador,
    });
  }

  @Put()
  async updateJogador(
    @Body() criarJogadorDto: CriarJogadorDto,
    @Query('jogadorID', JogadoresValidacaoParametrosPipe) jogadorID: string,
    @Res() res,
  ) {
    const jogador = await this.jogadoresService.updateJogador(
      jogadorID,
      criarJogadorDto,
    );

    if (!jogador) {
      throw new NotFoundException('jogador not found');
    }

    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      jogador,
    });
  }

  @Delete()
  async deletejogador(
    @Query('jogadorID', JogadoresValidacaoParametrosPipe) jogadorID: string,
    @Res() res,
  ) {
    const jogador = await this.jogadoresService.deleteJogador(jogadorID);
    if (!jogador) {
      throw new NotFoundException('jogador not found');
    }

    return res.status(HttpStatus.OK).json({
      isSuccess: true,
      jogador,
    });
  }
}
