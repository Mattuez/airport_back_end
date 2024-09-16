// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from './location/location.module';
import { Location } from './location/location';
import { FlightModule } from './flight/flightModule';
import {Flight} from "./flight/flight";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'locations_db',
      entities: [Location, Flight],
      synchronize: true,
    }),
    LocationModule,
    FlightModule,
  ],
})
export class AppModule {}
