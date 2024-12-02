import { ROOT_CONFIG_ALIAS_TOKEN } from './constants';
import { SetupConfigOptions } from './vo/setup-config-options';
import { getExistingFilePaths } from './utils/get-existing-file-paths';
import type { DynamicModule, Type } from '@nestjs/common';
import { fileLoader, TypedConfigModule } from '../core';

export function typedConfigModuleForRoot(
  baseDir: string,
  rootSchemaClass: Type<unknown>,
  options?: SetupConfigOptions,
) : DynamicModule{
  const existingFilePaths = getExistingFilePaths(
    baseDir,
    options?.folderName,
    options?.baseFileName,
    options?.profiles,
  );

  const dynamicModule = TypedConfigModule.forRoot({
    schema: rootSchemaClass,
    isGlobal: true,
    load: existingFilePaths.map((filePath) => {
      return fileLoader({
        absolutePath: filePath,
        ignoreEnvironmentVariableSubstitution: false,
        ignoreEmptySearchPlaces: false,
      });
    }),
  });

  return {
    ...dynamicModule,
    providers: [
      ...(dynamicModule.providers ?? []),
      {
        provide: ROOT_CONFIG_ALIAS_TOKEN,
        useExisting: rootSchemaClass,
      },
    ],
    exports: [...(dynamicModule.exports ?? []), ROOT_CONFIG_ALIAS_TOKEN],
  };
}

