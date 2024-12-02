// import { LoggerConfig } from "@aionx/logger";
import { ValidateNestedProperty } from '@aiofc/config';
import { AppConfig } from '@aiofc/fastify-server';
import { LoggerConfig } from '@aiofc/logger';
import { I18Config } from '@aiofc/i18n';

export default class RootConfig {
  @ValidateNestedProperty({ classType: AppConfig })
  public readonly app!: AppConfig;

  @ValidateNestedProperty({ classType: LoggerConfig })
  public readonly logger!: LoggerConfig;

  @ValidateNestedProperty({ classType: I18Config })
  public readonly i18!: I18Config;
}
