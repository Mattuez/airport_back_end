// src/locations/location.service.ts
import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private locationsRepository: Repository<Location>,
    ) {}

    findAll(): Promise<Location[]> {
        return this.locationsRepository.find();
    }

    async findOne(id: string): Promise<Location> {
        const location = await this.locationsRepository.findOne({ where: { id } });

        if (!location) {
            throw new NotFoundException(`Location with ID ${id} not found`);
        }

        return location;
    }

    create(location: Location): Promise<Location> {
        return this.locationsRepository.save(location);
    }

    async remove(id: string): Promise<void> {
        const location = await this.findOne(id);

        await this.locationsRepository.delete(location.id);
    }
}
