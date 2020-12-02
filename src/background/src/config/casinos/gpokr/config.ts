import Config from "../../../interfaces/Config";
import Protocol from "../../../interfaces/Protocol";
import { GameEvent } from "./game-event";

const config: Config<GameEvent> = {
  name: "gpokr",
  parser: (event: string): GameEvent[] => JSON.parse(event).events,
  protocol: Protocol.Http,
  srcUrls: [
    "*://*.gpokr.com/{,#R-O-B-B-Y,#HORSIE,#NAGLINJO,#GetPaid24,#Pacific Place}",
  ],
  targetUrls: ["*://*.gpokr.com/api/gpokr/table/events?*"],
  implicitBlinds: true,
  isEventList: true,
};

export default config;
