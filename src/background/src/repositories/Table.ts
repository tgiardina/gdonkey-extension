import { inject, injectable } from "inversify";
import { Table } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";
import { BlindSize } from "../enums";

@injectable()
export default class TableRepository {
  private bigBlind?: number;
  private smallBlind?: number;

  constructor(@inject(TYPES.Wire) private wire: Wire) {}

  public create(bigBlind: number, smallBlind: number): Table {
    return new Table(this.wire, bigBlind, smallBlind);
  }
}
