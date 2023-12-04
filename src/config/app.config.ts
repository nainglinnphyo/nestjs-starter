import * as crypto from 'crypto'; // Used to generate random UUIDs
import { IncomingMessage, ServerResponse } from 'http'; // Used to handle incoming and outgoing HTTP messages
import { LogLevel, NodeEnv } from 'src/shared/enums'; // Used to define parameters for the Pino logger
import { Params } from 'nestjs-pino';
import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  logo: string;
  name: string;
  panelUrl: string;
}

export const appConfig = (): IAppConfig => ({
  logo: process.env.APP_LOGO,
  name: process.env.APP_NAME,
  panelUrl: process.env.APP_PANEL_URL,
});

// Import external modules

export class AppConfig {
  public static getLoggerConfig(): Params {
    // Define the configuration for the Pino logger
    const { NODE_ENV, LOG_LEVEL, CLUSTERING } = process.env;

    return {
      exclude: [], // Exclude specific path from the logs and may not work for e2e testing
      pinoHttp: {
        genReqId: () => crypto.randomUUID(), // Generate a random UUID for each incoming request
        autoLogging: true, // Automatically log HTTP requests and responses
        base: CLUSTERING === 'true' ? { pid: process.pid } : {}, // Include the process ID in the logs if clustering is enabled
        customAttributeKeys: {
          responseTime: 'timeSpent', // Rename the responseTime attribute to timeSpent
        },
        level: LOG_LEVEL || (NODE_ENV === NodeEnv.PRODUCTION ? LogLevel.INFO : LogLevel.TRACE), // Set the log level based on the environment and configuration
        serializers: {
          req(request: IncomingMessage) {
            return {
              method: request.method,
              url: request.url,
              id: request.id,
              // Including the headers in the log could be in violation of privacy laws, e.g. GDPR.
              // headers: request.headers,
            };
          },
          res(reply: ServerResponse) {
            return {
              statusCode: reply.statusCode,
            };
          },
        },
        transport:
          NODE_ENV !== NodeEnv.PRODUCTION // Only use Pino-pretty in non-production environments
            ? {
                target: 'pino-pretty',
                options: {
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                },
              }
            : null,
      },
    };
  }
}

export default registerAs(
  'app',
  (): Record<string, any> => ({
    port: process.env.PORT || 3000,
    globalPrefix: '/api',
  }),
);
