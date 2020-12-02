import { Row } from "../interfaces";
import Wire from "../models/wire";
import Entity from "./Entity";

export default class Player extends Entity {
  public isUser: boolean;

  constructor(
    private wire: Wire,
    public readonly seat: number,
    private username: string,
    isUser?: boolean
  ) {
    super();
    this.isUser = !!isUser;
  }

  public async sync(casinoId: number): Promise<void> {
    if (this.id) return;
    const records = <Row[]>(
      await this.wire.get(
        `/casinos/${casinoId}/players?username=${this.username}`
      )
    );
    if (records.length) {
      this._id = records[0].id;
    } else {
      const record = <Row>await this.wire.post("/players", {
        player: {
          isMe: this.isUser,
          username: this.username,
          casinoId,
        },
      });
      this._id = record.id;
    }
  }
}
