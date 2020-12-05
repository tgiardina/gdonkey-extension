import { Player } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";

export default class PlayerRepository {
  constructor(private wire: Wire) {}

  public create(seat: number, username?: string): Player {
    if (!username)
      username = `anon${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    return new Player(this.wire, seat, username);
  }
}
