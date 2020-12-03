import { Seat } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";

export default class SeatRepository {
  constructor(private wire: Wire) {}

  public create(position: number, stack: number): Seat {
    return new Seat(this.wire, position, stack);
  }
}
