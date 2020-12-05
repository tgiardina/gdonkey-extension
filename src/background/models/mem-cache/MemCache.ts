import { inject, injectable } from "inversify";
import TYPES from "../../types";

@injectable()
export default class MemCache<T> {
  private value?: T;
  private listener: () => void;

  constructor(
    @inject(TYPES.Storage) private storage: typeof browser.storage,
    @inject(TYPES.TokenName) private cookieName: string
  ) {
    this.listener = async () => {
      this.value =
        <T | undefined>(await storage.sync.get(cookieName))[cookieName] ||
        undefined;
    };
    storage.onChanged.addListener(this.listener);
  }

  public async init(): Promise<void> {
    this.value =
      <T | undefined>(
        (await this.storage.sync.get(this.cookieName))[this.cookieName]
      ) || undefined;
  }

  public read(): T | undefined {
    return this.value;
  }

  public delete(): void {
    this.storage.onChanged.removeListener(this.listener);
  }
}
