export default function (casino: string) {
  const mockAxios = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  };

  const baseUrl = "fake-url";
  let seatId = 1;
  let anonPlayers = 0;
  mockAxios.post.mockImplementation((url: string) => {
    if (url === `${baseUrl}/games`) {
      return { data: { game: { id: 1 } } };
    } else if (url === `${baseUrl}/players`) {
      return { data: { player: { id: 2 } } };
    } else if (url === `${baseUrl}/seats`) {
      return { data: { seat: { id: seatId++ } } };
    } else if (url === `${baseUrl}/actions`) {
      return { data: { action: {} } };
    }
  });

  mockAxios.get.mockImplementation((url: string) => {
    if (url === `${baseUrl}/casinos`) {
      return { data: { casinos: [{ id: 1, name: casino }] } };
    } else if (url === `${baseUrl}/casinos/1/tables`) {
      return { data: { tables: [{ id: 1, bigBlind: 50, casinoId: 1 }] } };
    } else if (url === `${baseUrl}/casinos/1/players?username=PlayerA`) {
      return { data: { players: [{ id: 1 }] } };
    } else if (url === `${baseUrl}/casinos/1/players?username=PlayerB`) {
      return { data: { players: [] }};
    } else if (url.split("=").slice(-1)[0].substring(0, 4) === `anon`) {
      if (anonPlayers++ === 0) {
        return { data: { players: [{ id: 1 }] } };
      } else {
        return { data: { players: [] } };
      }
    }
  });
  return mockAxios;
}
