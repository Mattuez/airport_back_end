import {Controller, Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { LocationService } from './location.service';
import {CreateLocationDto} from "./dto/create-location.dto";
import {Location} from "./location";

@Controller('locations')
export class LocationController {
    constructor(private readonly locationsService: LocationService) {}

    @Get()
    findAll() {
        return this.locationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.locationsService.findOne(id);
    }

    @Post()
    create(@Body() inputLocation: CreateLocationDto) {
        const location: Location = new Location(inputLocation.cep, inputLocation.city, inputLocation.state);

        return this.locationsService.create(location);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() inputLocation: CreateLocationDto) {
        const updatedLocation: Location = new Location(inputLocation.cep, inputLocation.city, inputLocation.state);
        return this.locationsService.update(id, updatedLocation);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.locationsService.remove(id);
    }
}
