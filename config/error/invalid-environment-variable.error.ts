export class InvalidEnvironmentVariableError extends Error {
  constructor(variableName: string) {
    super(
      `Environment variable ${variableName} is invalid. Please make sure it is set correctly.`,
    );
  }
}
