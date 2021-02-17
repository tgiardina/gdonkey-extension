import { Blind } from "../entities";
import { BlindType } from "../enums";
import Wire from "../models/wire";

export default class BlindRepository {
  constructor(private wire: Wire) {}

  public create(seat: number, type: BlindType, amount: number): Blind {
    return new Blind(this.wire, seat, type, amount);
  }
}
