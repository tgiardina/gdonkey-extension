import mockAxios from "./mockAxios";
import mockContainer from "./mockContainer";
import init from "../../src/background/init";
import { Sniffer } from "@tgiardina/sniff";

export default function (
  casino: string,
  sniffHttp: Sniffer,
  sniffWs: Sniffer
): void {
  const axios = mockAxios(casino);
  const container = mockContainer(axios, sniffHttp, sniffWs);

  describe(casino, () => {
    it("should run without error", async () => {
      await init(container);
      await new Promise((res) => setTimeout(res, 50));
    });

    it("should have posted game", () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/games`,
        {
          game: {
            externalId: "200",
            startedAt: expect.anything(),
            tableId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it("should have posted second player", () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/players`,
        {
          player: {
            isMe: false,
            username:
              casino === "gpokr" ? "PlayerB" : expect.stringContaining("anon"),
            casinoId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted first player's seat`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/seats`,
        {
          seat: {
            position: 1,
            stack: 1500,
            gameId: 1,
            playerId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted second player's seat`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/seats`,
        {
          seat: {
            position: 0,
            stack: 5000,
            gameId: 1,
            playerId: 2,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted small blind`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            type: "PostBlind",
            amount: 25,
            street: "Preflop",
            seatId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted big blind`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            type: "PostBlind",
            amount: 50,
            street: "Preflop",
            seatId: 2,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted preflop actions`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 0,
            type: "CheckCall",
            delay: expect.anything(),
            street: "Preflop",
            seatId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 1,
            type: "CheckCall",
            delay: expect.anything(),
            street: "Preflop",
            seatId: 2,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted flop actions`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 0,
            type: "CheckCall",
            delay: expect.anything(),
            street: "Flop",
            seatId: 2,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 1,
            type: "CheckCall",
            delay: expect.anything(),
            street: "Flop",
            seatId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted turn actions`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 0,
            type: "CheckCall",
            delay: expect.anything(),
            street: "Turn",
            seatId: 2,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 1,
            type: "CheckCall",
            delay: expect.anything(),
            street: "Turn",
            seatId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have posted turn actions`, () => {
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 0,
            type: "CheckCall",
            delay: expect.anything(),
            street: "River",
            seatId: 2,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
      expect(axios.post).toHaveBeenCalledWith(
        `fake-url/actions`,
        {
          action: {
            tally: 1,
            type: "CheckCall",
            delay: expect.anything(),
            street: "River",
            seatId: 1,
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have put flop`, () => {
      expect(axios.put).toHaveBeenCalledWith(
        `fake-url/games/1/flop`,
        {
          flop: {
            cards: [
              {
                rank: 11,
                suit: 0,
              },
              {
                rank: 12,
                suit: 0,
              },
              {
                rank: 3,
                suit: 3,
              },
            ],
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have put turn`, () => {
      expect(axios.put).toHaveBeenCalledWith(
        `fake-url/games/1/turn`,
        {
          turn: {
            cards: [
              {
                rank: 5,
                suit: 0,
              },
            ],
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have put river`, () => {
      expect(axios.put).toHaveBeenCalledWith(
        `fake-url/games/1/river`,
        {
          river: {
            cards: [
              {
                rank: 3,
                suit: 2,
              },
            ],
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it(`should have put pocket`, () => {
      expect(axios.put).toHaveBeenCalledWith(
        `fake-url/seats/1/pocket`,
        {
          pocket: {
            cards: [
              {
                rank: 3,
                suit: 2,
              },
              {
                rank: 3,
                suit: 1,
              },              
            ],
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });    

    it(`should have patched endedAt`, () => {
      expect(axios.patch).toHaveBeenCalledWith(
        `fake-url/games/1`,
        {
          game: {
            endedAt: expect.anything(),
          },
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });
  });
}
