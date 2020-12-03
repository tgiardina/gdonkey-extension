import { BlindType, Street } from "../enums";
import { AlreadyPublishedError } from "../errors";
import { Row } from "../interfaces";
import Wire from "../models/wire";
import Entity from "./Entity";

export default class Blind extends Entity {
  constructor(
    private wire: Wire,
    public readonly seat: number,
    private type: BlindType,
    private amount: number
  ) {
    super();
  }

  public async publish(seatId: number): Promise<void> {
    if (this.id) throw new AlreadyPublishedError("action", this.id);
    const record = <Row>await this.wire.post("/actions", {
      action: {
        type: this.type,
        amount: this.amount,
        street: Street.Preflop,
        seatId,
      },
    });
    this._id = record.id;
  }
}
