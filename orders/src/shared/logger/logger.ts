import winston from "winston";

export const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const isDevelopment = (): boolean => {
  return process.env.LOCAL?.toLowerCase() === "true";
};

const level = (): string => {
  return isDevelopment() ? "debug" : "info";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "white",
  http: "magenta",
};

if (isDevelopment()) {
  winston.addColors(colors);
}

const format: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const developmentTransports: winston.transports.FileTransportInstance[] =
  isDevelopment()
    ? [
        new winston.transports.File({
          filename: "error.log",
          dirname: "logs/",
          level: "error",
          handleExceptions: true,
        }),

        new winston.transports.File({
          filename: "all.log",
          dirname: "logs/",
          handleExceptions: true,
        }),
      ]
    : [];

const consoleColorFormatting: winston.Logform.Format | Record<string, any> =
  isDevelopment()
    ? {
        format: winston.format.combine(
          format,
          winston.format.colorize({ all: true })
        ),
      }
    : {};

const transports: (
  | winston.transports.FileTransportInstance
  | winston.transports.ConsoleTransportInstance
)[] = [
  ...developmentTransports,
  new winston.transports.Console({
    ...consoleColorFormatting,
  }),
];

export const logger: winston.Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
