import { Sniffer } from "sniff";
import container from "../src/container";
import TYPES from "../src/types";

export default (
  mockedAxios: unknown,
  sniffHttp: Sniffer,
  sniffWs: Sniffer,
  casino: string
) => {
  container.rebind<Sniffer>(TYPES.SniffHttp).toConstantValue(sniffHttp);
  container.rebind<Sniffer>(TYPES.SniffWs).toConstantValue(sniffWs);
  container.rebind<string>(TYPES.TokenName).toConstantValue("token");
  container.rebind<unknown>(TYPES.Axios).toConstantValue(mockedAxios);
  container.rebind<string>(TYPES.NarrationUrl).toConstantValue("fake-url");
  container
    .rebind<() => string | undefined>(TYPES.TokenGenerator)
    .toConstantValue(() => "token");
  return container;
};
