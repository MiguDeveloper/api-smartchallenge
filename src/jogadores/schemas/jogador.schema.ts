import { Schema } from 'mongoose';

export const JogadorSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    telefoneCelular: { type: String, unique: true },
    email: { type: String, unique: true },
    ranking: String,
    posicaoRanking: Number,
    urlFotoJugador: { type: String, default: 'none' },
  },
  { timestamps: true, collection: 'jogadores' },
);
