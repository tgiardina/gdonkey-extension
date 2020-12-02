import Config from "../../../interfaces/Config";
import Protocol from "../../../interfaces/Protocol";
import { GameEvent } from "./game-event";

const config: Config<GameEvent> = {
  name: "bovada",
  parser: (event: string): GameEvent => JSON.parse(event.split("|")[1]),
  protocol: Protocol.WebSocket,
  srcUrls: ["*://*.bovada.lv/static/poker-game/*"],
  targetUrls: ["*://*.bovada.lv"],
  isAnon: true,
};

export default config;
