import { ActionType, Street } from '../enums';
import { AlreadyPublishedError } from "../errors";
import { Row } from "../interfaces";
import Wire from "../models/wire";
import Entity from "./Entity";

export default class Action extends Entity {
  constructor(
    private wire: Wire,
    public readonly seat: number,
    private type: ActionType,
    private amount: number | undefined,
  ) {
    super();
  }

  public async publish(seatId: number, street: Street, tally: number, delay: number): Promise<void> {
    if (this.id) throw new AlreadyPublishedError("action", this.id);
    const record = <Row>await this.wire.post("/actions", {
      action: {
        street,
        type: this.type,
        amount: this.amount,
        tally,
        delay,
        seatId,
      },
    });
    this._id = record.id;
  }
}
