import * as log from 'loglevel';

export enum FFCLogLevel {
  trace = 0,
  debug = 1,
  info = 2,
  warn = 3,
  error = 4,
  silent = 5,
}


export enum FFCLoggerNames {
  Default = 'ffc-rtc',
  Room = 'ffc-rtc-room',
  Participant = 'ffc-rtc-participant',
  Track = 'ffc-rtc-track',
  Publication = 'ffc-rtc-track-publication',
  Engine = 'ffc-rtc-engine',
  Signal = 'ffc-rtc-signal',
  PCManager = 'ffc-rtc-pc-manager',
  PCTransport = 'ffc-rtc-pc-transport',
  E2EE = 'ffc-rtc-lk-e2ee',
}

type FFCLogLevelString = keyof typeof FFCLogLevel;

export type FFCStructuredLogger = log.Logger & {
  trace: (msg: string, context?: object) => void;
  debug: (msg: string, context?: object) => void;
  info: (msg: string, context?: object) => void;
  warn: (msg: string, context?: object) => void;
  error: (msg: string, context?: object) => void;
  setDefaultLevel: (level: log.LogLevelDesc) => void;
  setLevel: (level: log.LogLevelDesc) => void;
  getLevel: () => number;
};

let ffcRtcLogger = log.getLogger('ffc-rtc');
const ffcRtcLoggers = Object.values(FFCLoggerNames).map((name) => log.getLogger(name));

ffcRtcLogger.setDefaultLevel(FFCLogLevel.info);

export default ffcRtcLogger as FFCStructuredLogger;

/**
 * @internal
 */
export function getLogger(name: string) {
  const logger = log.getLogger(name);
  logger.setDefaultLevel(ffcRtcLogger.getLevel());
  return logger as FFCStructuredLogger;
}

export function setLogLevel(level: FFCLogLevel | FFCLogLevelString, loggerName?: FFCLoggerNames) {
  if (loggerName) {
    log.getLogger(loggerName).setLevel(level);
  } else {
    for (const logger of ffcRtcLoggers) {
      logger.setLevel(level);
    }
  }
}

export type FFCLogExtension = (level: FFCLogLevel, msg: string, context?: object) => void;

export function setLogExtension(extension: FFCLogExtension, logger?: FFCStructuredLogger) {
  const loggers = logger ? [logger] : ffcRtcLoggers;

  loggers.forEach((logR) => {
    const originalFactory = logR.methodFactory;

    logR.methodFactory = (methodName, configLevel, loggerName) => {
      const rawMethod = originalFactory(methodName, configLevel, loggerName);

      const logLevel = FFCLogLevel[methodName as FFCLogLevelString];
      const needLog = logLevel >= configLevel && logLevel < FFCLogLevel.silent;

      return (msg, context?: [msg: string, context: object]) => {
        if (context) rawMethod(msg, context);
        else rawMethod(msg);
        if (needLog) {
          extension(logLevel, msg, context);
        }
      };
    };
    logR.setLevel(logR.getLevel());
  });
}

export const ffcWorkerLogger = log.getLogger('lk-e2ee') as FFCStructuredLogger;