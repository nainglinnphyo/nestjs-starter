export interface ITransmitterConfig {
  connectXToken: string;
  cronServiceUrl: string;
  messageStormServiceUrl: string;
}

export const transmitterConfig = (): ITransmitterConfig => ({
  connectXToken: process.env.CONNECT_X_TOKEN as string,
  cronServiceUrl: process.env.CRON_SERVICE_URL as string,
  messageStormServiceUrl: process.env.MESSAGE_STORM_SERVICE_URL as string,
});
