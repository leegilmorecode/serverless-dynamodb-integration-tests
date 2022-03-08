// this ensures that we don't log to the console when running unit and int tests i.e. less noise
const winston = {
  addColors: jest.fn(),
  format: {
    printf: jest.fn(),
    timestamp: jest.fn(),
    simple: jest.fn(),
    colorize: jest.fn(),
    combine: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
    DailyRotateFile: jest.fn(),
  },
  createLogger: jest.fn().mockImplementation(() => {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
  }),
};

export default winston;
