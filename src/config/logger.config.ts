/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import 'winston-daily-rotate-file';
import { format, transports } from 'winston';

export const winstonLoggerOptions = {
  transports: [
    // file on daily rotation (error only)
    new transports.DailyRotateFile({
      // %DATE will be replaced by the current date
      filename: `logs/%DATE%-error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // don't want to zip our logs
      maxFiles: '30d', // will keep log until they are older than 30 days
    }),
    // same for all levels
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    }),
    // remove comment to log to MongoDB
    // new winstonMongoDB.MongoDB({
    //   level: 'info',
    //   db: 'mongodb://localhost:27017/your-database-name',
    //   options: {
    //     useUnifiedTopology: true,
    //   },
    //   collection: 'logs',
    //   format: format.combine(
    //     format.timestamp(), // Add a timestamp to MongoDB logs
    //     format.json(), // Use JSON format for MongoDB logs
    //   ),
    // }),
    new transports.Console({
      format: format.combine(
        format.splat(),
        format.ms(),
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
        format.colorize({
          colors: { info: 'green', error: 'red', warn: 'yellow' },
          all: true,
          level: true,
          message: true,
        }),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: [${info.context}] ${info.message} ${info.ms}`;
        }),
      ),
    }),
  ],
};
