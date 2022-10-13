import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';

const { combine, timestamp, ms, printf } = format;
const consistentFormat = printf(({ level, message, timestamp, ms }) => {
  if (typeof message === 'object') {
    return `[${level}] ${timestamp} | ${JSON.stringify(message)} - ${ms}`;
  }
  return `[${level}] ${timestamp} | ${message} - ${ms}`;
});

export function winstonModuleFactory(): WinstonModuleOptions {
  return {
    transports: [
      new transports.Console({
        level: 'debug',
        format: combine(timestamp(), ms(), consistentFormat),
      }),
    ],
  };
}
