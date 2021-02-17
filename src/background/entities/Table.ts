import * as _ from "lodash";
import Entity from "./Entity";
import { Row } from "../interfaces";
import Wire from "../models/wire";
import { InvalidTableError } from "../errors";
import { GameType } from "gdonkey-translators/src/enums";

export default class Table extends Entity {
  constructor(
    private wire: Wire,
    public readonly gameType: GameType,
    public readonly bigBlind: number,
    public readonly smallBlind: number
  ) {
    super();
  }

  public async sync(casinoId: number): Promise<void> {
    const tables = <Row[]>await this.wire.get(`/casinos/${casinoId}/tables`);
    const table = _.find(tables, { gameType: this.gameType, bigBlind: this.bigBlind });
    if (!table) throw new InvalidTableError(casinoId, this.gameType, this.bigBlind);
    this._id = table.id;
  }
}
