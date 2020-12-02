import * as axios from "axios";
import { Container } from "inversify";
import { airLock, drainify, log, syncify } from "proxy-tools";
import { sniffHttp, sniffWs, Sniffer } from "sniff";
import casinos from "./config/casinos";
import Dispatcher from "./m/dispatcher";
import MemCache from "./models/mem-cache";
import Operator from "./m/operator";
import Wire from "./models/wire";
import CuratorFactory from "./factories/curator-factory";
import Casino from "./interfaces/Casino";
import TYPES from "./types";

const container = new Container();
// Utils
container.bind<(err: Error) => void>(TYPES.HandleErr).toConstantValue((err) => {
  console.log(err);
  console.log(JSON.stringify(err));
});
container.bind<Sniffer>(TYPES.SniffHttp).toConstantValue(sniffHttp);
container.bind<Sniffer>(TYPES.SniffWs).toConstantValue(sniffWs);
container
  .bind<typeof browser.storage>(TYPES.Storage)
  .toConstantValue(browser.storage);
container.bind<string>(TYPES.TokenName).toConstantValue("token");
container.bind<MemCache<string>>(TYPES.TokenCache).to(MemCache);
const tokenCache = <MemCache<string>>container.get(TYPES.TokenCache);
container.bind<typeof axios>(TYPES.Axios).toConstantValue(axios);
container
  .bind<string>(TYPES.NarrationUrl)
  .toConstantValue(<string>process.env.NARRATION_API);
container
  .bind<() => string | undefined>(TYPES.TokenGenerator)
  .toConstantValue(tokenCache.read.bind(tokenCache));
// Entities
container.bind<Wire>(TYPES.Wire).to(Wire).inSingletonScope();
container
  .bind<Operator>(TYPES.Operator)
  .to(Operator)
  .inSingletonScope()
  .onActivation((_context, operator) => {
    return log(operator, console.log, "operator");
  });
container
  .bind<Dispatcher>(TYPES.Dispatcher)
  .to(Dispatcher)
  .onActivation((_context, dispatcher) => {
    return log(
      airLock(
        drainify(
          syncify(log(dispatcher, console.log, "dispatcher")),
          () => !tokenCache.read.bind(tokenCache)
        ),
        "endGame"
      ),
      console.log,
      "predispatcher"
    );
  });
container.bind<CuratorFactory>(TYPES.CuratorFactory).to(CuratorFactory);
container
  .bind<Record<string, Casino<unknown>>>(TYPES.Casinos)
  .toConstantValue(casinos);

export default container;
