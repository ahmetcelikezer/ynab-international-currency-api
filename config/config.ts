export class Config {
  public static getEnvironmentVariable(key: string): string | undefined {
    return process.env[key];
  }

  public static getEnvironmentVariableWithFallback(
    key: string,
    defaultValue: string,
  ): string {
    return process.env[key] || defaultValue;
  }
}
