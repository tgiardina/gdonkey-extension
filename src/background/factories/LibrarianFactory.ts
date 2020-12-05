import { inject, injectable } from "inversify";
import Config from "../interfaces/Config";
import { Librarian } from "../models";
import { Repositories } from "../repositories";
import TYPES from "../types";

@injectable()
export default class LibrarianFactory {
  constructor(@inject(TYPES.Repos) private repos: Repositories) {}

  public create(config: Config): Librarian {
    return new Librarian(this.repos, config);
  }
}
