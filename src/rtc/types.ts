export type FFCLoggerOptions = {
  loggerName?: string;
  loggerContextCb?: () => Record<string, unknown>;
};