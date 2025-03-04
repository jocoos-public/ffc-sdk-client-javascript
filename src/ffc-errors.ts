export class FFCError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export class FFCCliCredentialsError extends FFCError {
  constructor(msg: string) {
    super('FFC_CLI_CREDENTIALS_ERROR', msg);
  }
}

export class SdkNotInitializedError extends FFCError {
  constructor() {
    super('SDK_NOT_INITIALIZED', 'sdk not initialized');
  }
}

export class InvalidFFCEnumStringError<T extends Record<string, string>> extends FFCError {
  constructor(type: T, value: string) {
    super('INVALID_FFC_ENUM_STRING', `${type.constructor.name} does not enumerate value: ${value}`);
  }
}