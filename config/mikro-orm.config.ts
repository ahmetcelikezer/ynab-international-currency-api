import { LoadStrategy } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Config } from '@config/config';
import { EEnvironment } from '@config/app.config';

export default {
  type: 'postgresql',
  clientUrl: Config.getEnvironmentVariable('DATABASE_URL'),
  entities: ['dist/**/entity/*.entity.js'],
  entitiesTs: ['src/**/entity/*.entity.ts'],
  debug: Config.getEnvironmentVariable('NODE_ENV') !== EEnvironment.PRODUCTION,
  loadStrategy: LoadStrategy.JOINED,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  registerRequestContext: false,
  allowGlobalContext: true,
  seeder: {
    path: 'dist/src/seeders',
    pathTs: 'src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string): string => className,
  },
  migrations: {
    tableName: 'migrations',
    path: 'dist/migrations',
    pathTs: 'migrations',
    disableForeignKeys: false,
    allOrNothing: true,
    snapshot: true,
  },
};
