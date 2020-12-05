import { Sniffer } from "@tgiardina/sniff";
import getContainer from "../../src/background/container";
import TYPES from "../../src/background/types";

export default (mockedAxios: unknown, sniffHttp: Sniffer, sniffWs: Sniffer) => {
  const container = getContainer();
  // Museum Pipeline
  container.rebind(TYPES.NarrationUrl).toConstantValue("fake-url");
  container.rebind(TYPES.TokenGenerator).toConstantValue(() => "token");
  // Snifferes
  container.rebind(TYPES.SniffHttp).toConstantValue(sniffHttp);
  container.rebind(TYPES.SniffWs).toConstantValue(sniffWs);
  // Tokens
  container.rebind(TYPES.TokenName).toConstantValue("token");
  // Utils
  // container.rebind(TYPES.Logger).toConstantValue(() => { /* Don't log during tests. */})
  container.rebind(TYPES.HandleErr).toConstantValue((err: Error) => {
    throw err;
  });
  container.rebind(TYPES.Axios).toConstantValue(mockedAxios);

  return container;
};
