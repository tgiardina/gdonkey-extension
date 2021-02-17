import { Game } from "../entities";
import Wire from "../models/wire";

export default class GameRepository {
  constructor(private wire: Wire) {}

  public create(externalId: string): Game {
    return new Game(this.wire, externalId);
  }
}
