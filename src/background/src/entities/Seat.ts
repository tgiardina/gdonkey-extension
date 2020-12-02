import { AlreadyPublishedError } from "../errors";
import { Row } from "../interfaces";
import Wire from "../models/wire";
import Entity from "./Entity";

export default class Seat extends Entity {
  constructor(
    private wire: Wire,
    private position: number,
    private stack: number
  ) {
    super();
  }

  public async publish(gameId: number, playerId: number): Promise<void> {
    if (this.id) throw new AlreadyPublishedError("seat", this.id);
    const record = <Row>await this.wire.post("/seats", {
      seat: {
        position: this.position,
        stack: this.stack,
        gameId,
        playerId,
      },
    });
    this._id = record.id;
  }
}
