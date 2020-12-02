import { Container } from "inversify";
import { apply, log, split } from "proxy-tools";
import { SniffedMessage, Sniffer } from "sniff";
import Router from "./models/router";
import casinos from "./config/casinos";
import MemCache from "./models/mem-cache";
import TYPES from "./types";
import CuratorFactory from "./factories/curator-factory";

export default async (container: Container) => {
  const handleError = <(err: Error) => void>container.get(TYPES.HandleErr);
  const sniffHttp = <Sniffer>container.get(TYPES.SniffHttp);
  const sniffWs = <Sniffer>container.get(TYPES.SniffWs);
  const tokenCache = <MemCache<string>>container.get(TYPES.TokenCache);

  await tokenCache.init();

  const router = new Router(
    Object.values(casinos).map((casino) => {
      const curatorFactory = <CuratorFactory>(
        container.get(TYPES.CuratorFactory)
      );
      const config = casino.config;
      return {
        urls: casino.config.srcUrls,
        init: () =>
          apply(
            split(
              log(
                new casino.Translator(
                  log(
                    curatorFactory.create(config),
                    console.log,
                    `${config.name}.curator`
                  )
                ),
                console.log,
                `${config.name}.translator`
              )
            ),
            (json: string) =>
              config.isEventList
                ? <unknown[]>config.parser(json)
                : [config.parser(json)]
          ),
      };
    })
  );

  const sniff = (msg: SniffedMessage): void => {
    const translator = router.connect(msg.tabId, msg.srcUrl);
    if (!translator) return;
    try {
      translator.translate(msg.data);
    } catch (err) {
      handleError(err);
    }
  };

  sniffHttp(sniff);

  sniffWs(sniff);

  browser.tabs.onRemoved.addListener((tabId) => {
    router.disconnect(tabId);
  });
};
