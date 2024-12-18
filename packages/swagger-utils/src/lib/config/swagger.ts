import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Allow,
  IsBoolean,
} from 'class-validator';
import { BooleanType } from '@aiofc/validation';

export class SwaggerConfig {
  @IsString()
  title!: string;

  @BooleanType
  @IsBoolean()
  enabled = false;

  @IsString()
  swaggerPath!: string;

  @IsString()
  description!: string;

  @IsString()
  version!: string;

  @IsString()
  contactName!: string;

  @IsEmail()
  contactEmail!: string;

  @IsUrl()
  contactUrl!: string;

  @Allow()
  @IsOptional()
  servers?: Server[];
}

export class Server {
  @IsString()
  url!: string;

  @IsString()
  description!: string;
}
