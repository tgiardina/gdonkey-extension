import { Sniffer } from "@tgiardina/sniff";
import { Container } from "inversify";
import getContainer from "../../src/background/container";
import TYPES from "../../src/background/types";

export default function mockContainer(mockedAxios: unknown, sniffHttp: Sniffer, sniffWs: Sniffer): Container {
  const container = getContainer((() => {/* Don't log anything */}));
  // Museum Pipeline
  container.rebind(TYPES.NarrationUrl).toConstantValue("fake-url");
  container.rebind(TYPES.TokenGenerator).toConstantValue(() => "token");
  // Snifferes
  container.rebind(TYPES.SniffHttp).toConstantValue(sniffHttp);
  container.rebind(TYPES.SniffWs).toConstantValue(sniffWs);
  // Tokens
  container.rebind(TYPES.TokenName).toConstantValue("token");
  // Utils
  container.rebind(TYPES.Axios).toConstantValue(mockedAxios);

  return container;
}
