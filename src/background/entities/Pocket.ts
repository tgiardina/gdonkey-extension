import { Card } from "../interfaces";
import Wire from "../models/wire";

export default class Pocket {
  constructor(
    private wire: Wire,
    public readonly seat: number,
    private card1: Card,
    private card2: Card
  ) {}

  public async sync(seatId: number): Promise<void> {
    await this.wire.put(`/seats/${seatId}/pocket`, {
      pocket: {
        cards: [this.card1, this.card2],
      },
    });
  }
}
