class SyncerFactory {
  constructor() {
    
  }
}

const getSyncer = () => ({
  sync: jest.fn()
})

const getPublisher = () => ({
  publish: jest.fn()
})

export default {
  action: {
    create: jest.fn(() => {
      const entity = getSyncer();
      
      return 
    }),
    children: [],
  },
  blind: {
    create: jest.fn(() => {
      return jest.fn()
    }),<
  },
  board: {
    create: jest.fn(() => {
      return jest.fn()
    }),
  },
  casino: {
    create: jest.fn(() => {
      return jest.fn()
    }),
  },
  game: {
    create: jest.fn(() => {
      return jest.fn()
    }),
  },
  player: {
    create: jest.fn(() => {
      return jest.fn()
    }),
  },
  pocket: {
    create: jest.fn(() => {
      return jest.fn()
    }),
  },
  seat: {
    create: jest.fn(() => {
      return jest.fn()
    }),
  },
  table: {
    build: jest.fn(() => {
      return jest.fn()
    }),
    create: jest.fn(() => {
      return jest.fn()
    }),
  },
};
