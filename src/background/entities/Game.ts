import { Row } from "../interfaces";
import Wire from "../models/wire";
import Entity from "./Entity";

export default class Game extends Entity {
  private startedAt: string;
  private endedAt?: string;

  constructor(private wire: Wire, private externalId: string) {
    super();
    this.startedAt = new Date().toISOString();
  }

  public end(): void {
    this.endedAt = new Date().toISOString();
  }

  public async sync(tableId: number): Promise<void> {
    if (!this.id) {
      const record = <Row>await this.wire.post("/games", {
        game: {
          externalId: this.externalId,
          startedAt: this.startedAt,
          endedAt: this.endedAt,
          tableId,
        },
      });
      this._id = record.id;
    } else {
      this.wire.patch(`/games/${this.id}`, {
        game: {
          endedAt: this.endedAt,
        },
      });
    }
  }
}
