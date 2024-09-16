import {Controller, Get, Post, Body, Param, Delete, NotFoundException, Put} from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { LocationService } from '../location/location.service';
import {CreateFlightDto} from "./dto/create-flight.dto";

@Controller('flights')
export class FlightController {
    constructor(
        private readonly flightService: FlightService,
        private readonly locationService: LocationService,
    ) {}

    @Get()
    findAll() {
        return this.flightService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.flightService.findOne(id);
    }

    @Post()
    async create(@Body() flightInput: CreateFlightDto) {
        const source = await this.locationService.findOne(flightInput.source_id);
        const destiny = await this.locationService.findOne(flightInput.destiny_id);

        const flight = new Flight(source, destiny, flightInput.date);

        return this.flightService.create(flight);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() flightInput: CreateFlightDto) {
        const source = await this.locationService.findOne(flightInput.source_id);
        const destiny = await this.locationService.findOne(flightInput.destiny_id);

        const updatedFlight = new Flight(source, destiny, flightInput.date);

        return this.flightService.update(id, updatedFlight);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.flightService.remove(id);
    }
}
