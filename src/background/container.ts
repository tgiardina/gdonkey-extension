import * as axios from "axios";
import { Container } from "inversify";
import { addLogger } from "@tgiardina/proxy-tools";
import { sniffHttp, sniffWs } from "@tgiardina/sniff";
import { casinos } from "gdonkey-translators";
import { ControllerFactory, LibrarianFactory } from "./factories";
import { Curator, MemCache, Stopwatch, Tallier, Wire } from "./models";
import TYPES from "./types";
import { Repositories } from "./repositories";
import { Config } from "gdonkey-translators/src/interfaces";

export default function getContainer(
  logger: (obj: unknown) => void
): Container {
  const container = new Container();
  // Utils
  container.bind(TYPES.Logger).toConstantValue(logger);
  /* istanbul ignore next */  
  container.bind(TYPES.HandleErr).toConstantValue((err: Error) => {
    logger(err);
    logger(JSON.stringify(err));
  });
  // Museum Pipeline
  container
    .bind(TYPES.NarrationUrl)
    .toConstantValue(<string>process.env.NARRATION_API);
  container.bind(TYPES.Axios).toConstantValue(axios);
  container.bind<Wire>(TYPES.Wire).to(Wire).inSingletonScope();
  container.bind(TYPES.Stopwatch).to(Stopwatch);
  container.bind(TYPES.Tallier).to(Tallier);
  container
    .bind<Curator>(TYPES.Curator)
    .to(Curator)
    .onActivation((_context, curator) => {
      return addLogger(curator, logger, "curator");
    });
  container.bind(TYPES.Repos).to(Repositories).inSingletonScope();
  container
    .bind<LibrarianFactory>(TYPES.LibrarianFactory)
    .to(LibrarianFactory)
    .inSingletonScope()
    .onActivation((_context, factory) => {
      const ogCreate = factory.create.bind(factory);
      factory.create = (config: Config) =>
        addLogger(ogCreate(config), logger, "librarian");
      return factory;
    });
  container.bind(TYPES.ControllerFactory).to(ControllerFactory)
    .inSingletonScope;
  container.bind(TYPES.Casinos).toConstantValue(casinos);
  // Sniffers
  container.bind(TYPES.SniffHttp).toConstantValue(sniffHttp);
  container.bind(TYPES.SniffWs).toConstantValue(sniffWs);
  // Tokens
  container.bind(TYPES.TokenName).toConstantValue("token");
  container.bind(TYPES.Storage).toConstantValue(browser.storage);
  container.bind(TYPES.TokenCache).to(MemCache);
  const tokenCache = <MemCache<string>>container.get(TYPES.TokenCache);
  container
    .bind(TYPES.TokenGenerator)
    .toConstantValue(tokenCache.read.bind(tokenCache));
  return container;
}
