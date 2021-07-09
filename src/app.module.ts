import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    JogadoresModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
