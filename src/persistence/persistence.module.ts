import { Module, OnApplicationShutdown } from '@nestjs/common';
import { InjectKnex, Knex, KnexModule } from 'nestjs-knex';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ThingDescriptionRepository } from './thing-description.repository';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        config: {
          client: 'pg',
          connection: {
            host: config.dbHost,
            port: config.dbPort,
            user: config.dbUser,
            password: config.dbPassword,
            database: config.dbDatabase,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserRepository, ThingDescriptionRepository],
  exports: [UserRepository, ThingDescriptionRepository],
})
export class PersistenceModule implements OnApplicationShutdown {
  public constructor(@InjectKnex() private readonly knex: Knex) {}

  public onApplicationShutdown(signal?: string | undefined) {
    this.knex.destroy();
  }
}
