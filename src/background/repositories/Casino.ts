import { Casino } from "../entities";
import Wire from "../models/wire";

export default class CasinoRepository {
  constructor(private wire: Wire) {}

  public create(name: string): Casino {
    return new Casino(this.wire, name);
  }
}
