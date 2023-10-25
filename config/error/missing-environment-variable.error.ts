export class MissingEnvironmentVariableError extends Error {
  constructor(variableName: string) {
    super(
      `Environment variable ${variableName} is missing. Please make sure it is set.`,
    );
  }
}
