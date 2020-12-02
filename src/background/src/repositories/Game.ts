import { Game } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";
import { inject, injectable } from "inversify";

@injectable()
export default class GameRepository {
  constructor(@inject(TYPES.Wire) private wire: Wire) {}

  public create(externalId: string): Game {
    return new Game(this.wire, externalId);
  }
}
