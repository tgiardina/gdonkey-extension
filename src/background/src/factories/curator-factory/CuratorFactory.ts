import { inject, injectable } from "inversify";
import Curator from "../../m/curator";
import Dispatcher from "../../m/dispatcher";
import CasinoConfig from "../../interfaces/Config";
import TYPES from "../../types";

@injectable()
export default class CuratorFactory {
  constructor(@inject(TYPES.Dispatcher) private dispatcher: Dispatcher) {}

  public create(config: CasinoConfig<unknown>): Curator {
    return new Curator(this.dispatcher, config);
  }
}
