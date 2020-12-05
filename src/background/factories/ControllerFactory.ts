import { inject, injectable } from "inversify";
import Config from "../interfaces/Config";
import { Controller, Curator } from "../models";
import TYPES from "../types";
import LibrarianFactory from "./LibrarianFactory";

@injectable()
export default class ControllerFactory {
  constructor(
    @inject(TYPES.LibrarianFactory) private librarianFactory: LibrarianFactory,
    @inject(TYPES.Curator) private curator: Curator
  ) {}

  public create(config: Config): Controller {
    return new Controller(this.curator, this.librarianFactory.create(config));
  }
}
