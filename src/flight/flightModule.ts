import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightService } from './flight.service';
import { FlightController } from './flightController';
import { Flight } from './flight';
import { Location } from '../location/location';
import {LocationModule} from "../location/location.module";

@Module({
  imports: [TypeOrmModule.forFeature([Flight, Location]), LocationModule],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
