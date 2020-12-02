import { AxiosStatic } from "axios";
import { inject, injectable } from "inversify";
import Row from "../../interfaces/Row";
import TYPES from "../../types";

@injectable()
export default class Wire {
  constructor(
    @inject(TYPES.Axios) private cable: AxiosStatic,
    @inject(TYPES.NarrationUrl) private dest: string,
    @inject(TYPES.TokenGenerator) private sign: () => string | undefined
  ) {}

  public async post(url: string, data: unknown): Promise<Row | Row[]> {
    const response = await this.cable.post(
      `${this.dest}${url}`,
      data,
      this.signHeader()
    );
    return <Row | Row[]>Object.values(response.data)[0];
  }

  public async get(url: string): Promise<Row | Row[]> {
    const response = await this.cable.get(
      `${this.dest}${url}`,
      this.signHeader()
    );
    return <Row | Row[]>Object.values(response.data)[0];
  }

  public async put(url: string, data: unknown): Promise<void> {
    await this.cable.put(`${this.dest}${url}`, data, this.signHeader());
  }

  public async patch(url: string, data: unknown): Promise<void> {
    await this.cable.patch(`${this.dest}${url}`, data, this.signHeader());
  }

  private signHeader(): { headers: { Authorization: string } } | undefined {
    const token = this.sign();
    return token
      ? { headers: { Authorization: `Bearer ${this.sign()}` } }
      : undefined;
  }
}
