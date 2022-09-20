import winston from "winston";

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    // new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console({ format: winston.format.simple() }),
    // new winston.transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
