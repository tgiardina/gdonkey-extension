import { Casino } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";
import { inject, injectable } from "inversify";

@injectable()
export default class CasinoRepository {
  constructor(@inject(TYPES.Wire) private wire: Wire) {}

  public create(name: string): Casino {
    return new Casino(this.wire, name);
  }
}
