import { Blind } from "../entities";
import { BlindType } from "../enums";
import Wire from "../models/wire";
import TYPES from "../types";
import { inject, injectable } from "inversify";

@injectable()
export default class BlindRepository {
  constructor(@inject(TYPES.Wire) private wire: Wire) {}

  public create(seat: number, type: BlindType, amount: number): Blind {
    return new Blind(this.wire, seat, type, amount);
  }
}
