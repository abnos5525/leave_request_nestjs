import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db.postgres.host'),
        port: configService.get('db.postgres.port'),
        username: configService.get('db.postgres.username'),
        password: configService.get('db.postgres.password'),
        database: configService.get('db.postgres.name'),
        entities: [__dirname + '/../../entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
        migrationsTableName: 'migrations',
        synchronize: false,
        logging: ['error'],
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class PostgresModule {}
