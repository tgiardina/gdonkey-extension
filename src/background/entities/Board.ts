import { Street } from "../enums";
import { Card } from "../interfaces";
import Wire from "../models/wire";

export default class Board {
  private cards: Card[];

  constructor(private wire: Wire) {
    this.cards = [];
  }

  get street(): Street {
    if (this.cards.length < 3) {
      return Street.Preflop;
    } else if (this.cards.length === 3) {
      return Street.Flop;
    } else if (this.cards.length === 4) {
      return Street.Turn;
    } else {
      return Street.River;
    }
  }

  public push(...cards: Card[]) {
    this.cards.push(...cards);
  }

  public async sync(gameId: number): Promise<void> {
    if (this.cards.length >= 3) {
      await this.wire.put(`/games/${gameId}/flop`, {
        flop: {
          cards: this.cards.slice(0, 3),
        },
      });
    }
    if (this.cards.length >= 4) {
      await this.wire.put(`/games/${gameId}/turn`, {
        turn: {
          cards: this.cards.slice(3, 4),
        },
      });
    }
    if (this.cards.length >= 5) {
      await this.wire.put(`/games/${gameId}/river`, {
        river: {
          cards: this.cards.slice(4, 5),
        },
      });
    }
  }
}
