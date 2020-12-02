import { SniffedMessage } from "sniff";

const events = [
  {
    pid: "CO_OPTION_INFO",
    bblind: 50,
    sblind: 25,
  },
  {
    pid: "CO_RESULT_INFO",
    account: [1500, 5000, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    pid: "PLAY_STAGE_INFO",
    stageNo: "200",
  },
  {
    pid: "CO_TABLE_STATE",
    tableState: 2,
  },
  {
    pid: "CO_DEALER_SEAT",
    seat: 1,
  },
  {
    pid: "CO_BLIND_INFO",
    seat: 1,
    bet: 25,
    dead: 0,
  },
  {
    pid: "CO_BLIND_INFO",
    seat: 2,
    bet: 50,
    dead: 0,
  },
  {
    pid: "CO_CARDTABLE_INFO",
    seat1: [32896, 32896],
    seat2: [32896, 32896],
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 1,
    btn: 256,
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 2,
    btn: 64,
  },
  {
    pid: "CO_BCARD3_INFO",
    bcard: [12, 0, 43],
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 2,
    btn: 64,
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 1,
    btn: 64,
  },
  {
    pid: "CO_BCARD1_INFO",
    card: 6,
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 2,
    btn: 64,
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 1,
    btn: 64,
  },
  {
    pid: "CO_BCARD1_INFO",
    card: 30,
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 2,
    btn: 64,
  },
  {
    pid: "CO_SELECT_INFO",
    seat: 1,
    btn: 64,
  },
  {
    pid: "CO_RESULT_INFO",
    account: [1500, 5000, 0, 0, 0, 0, 0, 0, 0],
  },
];

export default function wsSniffer(
  callback: (msg: SniffedMessage) => void
): void {
  events.forEach((event) => {
    callback({
      data: `0 | ${JSON.stringify({ ...event })}`,
      srcUrl:
        "https://www.bovada.lv/static/poker-game/?lobby=%2Fpoker-lobby%2Fhome%3Foverlay%3Djoin",
      targetUrl:
        "wss://pkscb.bovada.lv/poker-games/rgs?X-Atmosphere-tracking-id=0&X-Atmosphere-Framework=2.3.8-javascript&X-Atmosphere-Transport=websocket&X-Atmosphere-TrackMessageSize=true&Content-Type=application/json&X-atmo-protocol=true",
      tabId: 1,
    });
  });
}
