import {
  Allow,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  BooleanType,
  IntegerType,
  ValidateNestedProperty,
} from '@aiofc/validation';
import { NamingStrategyInterface } from 'typeorm/naming-strategy/NamingStrategyInterface';
/**
 * @description 用于配置数据库连接的 SSL 选项
 * @class DbSSLExtraConfig
 */
class DbSSLExtraConfig {
  @IsBoolean()
  @BooleanType
  @IsOptional()
  rejectUnauthorized?: boolean; // 是否拒绝未经授权的连接

  //SSL 证书的相关信息（ca、key、cert）
  @IsString()
  @IsOptional()
  ca?: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  @IsOptional()
  cert?: string;
}
/**
 * @description 额外的数据库设置
 * @class DbExtraSettings
 */
class DbExtraSettings {
  @IsInt()
  max = 100;

  @ValidateNestedProperty({ required: false, classType: DbSSLExtraConfig })
  ssl?: DbSSLExtraConfig;
}
/**
 * @description 数据库连接的配置
 * @export
 * @class DbConfig
 */
export class DbConfig {
  @IsString()
  type!: string;

  @IsString()
  applicationName!: string;

  @IsString()
  host = 'localhost';

  @IsInt()
  @Min(0)
  @Max(65_535)
  @IntegerType
  port = 5432;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  database!: string;

  @IsBoolean()
  @BooleanType
  synchronize = false;

  @IsBoolean()
  @BooleanType
  logNotifications = true;

  @IsBoolean()
  @BooleanType
  migrationsRun = false;

  @IsBoolean()
  @BooleanType
  dropSchema!: false;

  @IsBoolean()
  @BooleanType
  keepConnectionAlive!: true;

  @IsBoolean()
  @BooleanType
  ssl = false;

  @IsBoolean()
  @BooleanType
  logging!: boolean;

  @IsBoolean()
  @BooleanType
  autoLoadEntities = true;

  @ValidateNestedProperty({ required: false, classType: DbExtraSettings })
  extra: DbExtraSettings = new DbExtraSettings();

  @Allow()
  namingStrategy: NamingStrategyInterface = new SnakeNamingStrategy();

  @IsBoolean()
  @BooleanType
  runSeeds = false;

  @IsBoolean()
  @BooleanType
  verboseRetryLog = false;

  @IsString()
  @IsOptional()
  migrationsTableName?: string;

  @IsEnum(['all', 'none', 'each'])
  @IsOptional()
  migrationsTransactionMode?: 'all' | 'none' | 'each';

  @IsString()
  @IsOptional()
  metadataTableName?: string;

  @IsEnum(['advanced-console', 'simple-console', 'file', 'debug'])
  @IsOptional()
  logger?: 'advanced-console' | 'simple-console' | 'file' | 'debug';

  @IsOptional()
  @IsNumber()
  maxQueryExecutionTime?: number = 5000;

  @IsOptional()
  @Min(1)
  @IsNumber()
  poolSize?: number = 30;
}
