import { Container } from "inversify";
import {
  addLogger,
  addSplitter,
  addQueue,
  addTranslator,
} from "@tgiardina/proxy-tools";
import { SniffedMessage, Sniffer } from "@tgiardina/sniff";
import { ControllerFactory } from "./factories";
import { MemCache, Router } from "./models";
import TYPES from "./types";
import { Casinos } from "gdonkey-translators";

export default async function init(container: Container): Promise<void> {
  const tokenCache = <MemCache<string>>container.get(TYPES.TokenCache);
  // Sniffers
  const sniffHttp = <Sniffer>container.get(TYPES.SniffHttp);
  const sniffWs = <Sniffer>container.get(TYPES.SniffWs);
  // Museum Pipeline
  const casinos = <Casinos>container.get(TYPES.Casinos);
  const controllerFactory = <ControllerFactory>(
    container.get(TYPES.ControllerFactory)
  );
  // Utils
  const logger = <(obj: unknown) => void>container.get(TYPES.Logger);
  const handleError = <(err: Error) => void>container.get(TYPES.HandleErr);

  await tokenCache.init();

  const router = new Router(
    Object.values(casinos).map((casino) => {
      const config = casino.config;
      const controller = addQueue(
        addLogger(
          controllerFactory.create(config),
          logger,
          `${config.name}.controller`
        ),
        handleError
      );
      const translator = addLogger(
        addTranslator(
          addSplitter(new casino.Translator(controller)),
          casino.parse
        ),
        logger,
        `${config.name}.translator`
      );
      return {
        urls: casino.config.srcUrls,
        init: () => translator,
      };
    })
  );

  const sniff = (msg: SniffedMessage): void => {
    const translator = router.connect(msg.tabId, msg.srcUrl);
    if (!translator) return;
    try {
      translator.translate(msg.data);
    } catch (err) {
      /* istanbul ignore next */            
      handleError(err);
    }
  };

  sniffHttp(sniff);
  sniffWs(sniff);

  browser.tabs.onRemoved.addListener((tabId) => {
    router.disconnect(tabId);
  });
}
