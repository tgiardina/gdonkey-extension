import * as _ from "lodash";
import Entity from "./Entity";
import { InvalidCasinoError } from "../errors";
import { Row } from "../interfaces";
import Wire from "../models/wire";

export default class Casino extends Entity {
  constructor(private wire: Wire, public readonly name: string) {
    super();
  }

  public async sync(): Promise<void> {
    const casinos = <Row[]>await this.wire.get("/casinos");
    const casino = _.find(casinos, ["name", this.name]);
    if (!casino) throw new InvalidCasinoError(this.name);
    this._id = casino.id;
  }
}
