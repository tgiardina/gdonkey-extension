import { Seat } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";
import { inject, injectable } from "inversify";

@injectable()
export default class SeatRepository {
  constructor(@inject(TYPES.Wire) private wire: Wire) {}

  public create(position: number, stack: number): Seat {
    return new Seat(this.wire, position, stack);
  }
}
