import { createLogger, transports, format, addColors } from "winston";
const { combine, timestamp, label, printf } = format;

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue"
    }
};

addColors(customLevels.colors);

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

export const userLogger = createLogger({
    levels: customLevels.levels,
    format: combine(
        label({ label: "user" }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

export const configLogger = createLogger({
    levels: customLevels.levels,
    format: combine(
        label({ label: 'config' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

export const customerLogger = createLogger({
    format: combine(
        label({ label: 'customer' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

export const ticketLogger = createLogger({
    format: combine(
        label({ label: 'ticket' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

export const lineLogger = createLogger({
    format: combine(
        label({ label: 'line' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

export const tripLogger = createLogger({
    format: combine(
        label({ label: 'trip' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

export const driverLogger = createLogger({
    format: combine(
        label({ label: 'driver' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

export const serverLogger = createLogger({
    levels: customLevels.levels,
    format: combine(
        label({ label: "server" }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "combined.log"})
    ]
});

