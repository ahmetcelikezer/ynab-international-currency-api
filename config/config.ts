import { MissingEnvironmentVariableError } from '@config/error/missing-environment-variable.error';

export class Config {
  /**
   * Get environment variable or throw error if not found.
   *
   * @param {string} key Environment variable key
   * @throws {MissingEnvironmentVariableError} If environment variable is not found
   * @returns {string} Environment variable value
   */
  public static getEnvironmentVariable(key: string): string {
    const variable: string | undefined = process.env[key];

    if (!variable) {
      throw new MissingEnvironmentVariableError(key);
    }

    return variable;
  }

  /**
   * Get environment variable or return default value if not found.
   *
   * @param {string} key Environment variable key
   * @param {string} defaultValue Default value
   * @returns {string} Environment variable value or default value
   */
  public static getEnvironmentVariableWithFallback(
    key: string,
    defaultValue: string,
  ): string {
    return process.env[key] || defaultValue;
  }
}
