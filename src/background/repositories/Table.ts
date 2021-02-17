import { GameType } from "gdonkey-translators/src/enums";
import { Table } from "../entities";
import Wire from "../models/wire";

export default class TableRepository {
  constructor(private wire: Wire) {}

  public create(gameType: GameType, bigBlind: number, smallBlind: number): Table {
    return new Table(this.wire, gameType, bigBlind, smallBlind);
  }
}
