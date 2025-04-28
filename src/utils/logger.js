import winston from "winston";

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf((info) => {
      const { timestamp, level, message, meta } = info;
      const req = meta && meta.req;
      const res = meta && meta.res;
      const requestId = req && req.id;
      const statusCode = res && res.statusCode;
      const durationMs = meta && meta.durationMs;

      const logMessage = `${timestamp} [${level}] ${requestId ? `[${requestId}] ` : ""}${message} ${
        req ? `(${req.method} ${req.originalUrl})` : ""
      } ${statusCode ? `status=${statusCode}` : ""} ${
        durationMs ? `durationMs=${durationMs}` : ""
      }`;

      return logMessage;
    })
  ),
});

winstonLogger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

const logger = {
  info: (message, ...extraMessages) => {
    winstonLogger.info(message, extraMessages);
  },

  error: (message) => {
    winstonLogger.error(message);
  },

  warn: (message) => {
    winstonLogger.warn(message);
  },
};

export default logger;
