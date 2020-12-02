import { SniffedMessage } from "sniff";

const events = [
  {
    table: {
      gameInfo: {
        playerInfo: [
          {
            forceBlind: false,
            user: {
              name: "PlayerA",
            },
          },
          {
            forceBlind: false,
            user: {
              name: "PlayerB",
            },
          },
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    },
    typeName: "TableUpdateEvent",
  },
  {
    smallblind: 25,
    bigblind: 50,
    chips: [1500, 5000, 0, 0, 0, 0, 0, 0, 0],
    dealer: 0,
    gameId: 200,
    typeName: "StartHandEvent",
  },
  { seat: 0, typeName: "CheckCallEvent" },
  { seat: 1, typeName: "CheckCallEvent" },
  {
    card1: { suit: 0, rank: 11 },
    card2: { suit: 0, rank: 12 },
    card3: { suit: 3, rank: 3 },
    typeName: "FlopEvent",
  },
  { seat: 1, typeName: "CheckCallEvent" },
  { seat: 0, typeName: "CheckCallEvent" },
  { card1: { suit: 0, rank: 5 }, typeName: "TurnEvent" },
  { seat: 1, typeName: "CheckCallEvent" },
  { seat: 0, typeName: "CheckCallEvent" },
  { card1: { suit: 2, rank: 3 }, typeName: "RiverEvent" },
  { seat: 1, typeName: "CheckCallEvent" },
  { seat: 0, typeName: "CheckCallEvent" },
  { typeName: "TakesPotEvent" },
];

export default function httpSniffer(
  callback: (msg: SniffedMessage) => void
): void {
  events.forEach((event) => {
    callback({
      data: JSON.stringify({ events: [event] }),
      srcUrl: "http://www.gpokr.com/#NAGLINJO",
      targetUrl: `http://www.gpokr.com/api/gpokr/table/events?t=${Date.now()}`,
      tabId: 1,
    });
  });
}
