import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';
import { JogadorSchema } from './schemas/Jogador.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Jogador', schema: JogadorSchema }]),
  ],
  exports: [JogadoresService],
  controllers: [JogadoresController],
  providers: [JogadoresService],
})
export class JogadoresModule {}
