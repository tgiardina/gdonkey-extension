import { Pocket } from "../entities";
import { Card } from "../interfaces";
import Wire from "../models/wire";

export default class PocketRepository {
  constructor(private wire: Wire) {}

  public create(seat: number, card1: Card, card2: Card): Pocket {
    return new Pocket(this.wire, seat, card1, card2);
  }
}
