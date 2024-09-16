import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Between, LessThanOrEqual, MoreThanOrEqual, Not, Repository} from 'typeorm';
import { Flight } from './flight';

@Injectable()
export class FlightService {
    constructor(
        @InjectRepository(Flight)
        private airportsRepository: Repository<Flight>,
    ) {}

    findAll(): Promise<Flight[]> {
        return this.airportsRepository.find({ relations: ['source', 'destiny'] });
    }

    async findOne(id: string): Promise<Flight> {
        const airport = await this.airportsRepository.findOne({ where: { id: id }, relations: ['_source', '_destiny'] });

        if (!airport) {
            throw new NotFoundException(`Airport with ID ${id} not found`);
        }

        return airport;
    }

    async create(flight: Flight): Promise<Flight> {
        flight.validateLocations();

        await Promise.all([
            this.validateFlightHour(flight),
            this.validateSameDayDestiny(flight)
        ]);

        return this.airportsRepository.save(flight);
    }


    async remove(id: string): Promise<void> {
        const airport = await this.findOne(id);

        await this.airportsRepository.delete(airport.id)
    }

    async findFlightsBetweenDates(startDate: Date, endDate: Date, flightId: string): Promise<Flight[]> {
        const flights = await this.airportsRepository.find({
            where: {
                date: Between(startDate, endDate),
                id: Not(flightId)
            },
            relations: ['source', 'destiny'],
        });

        return flights;
    }

    private async validateFlightHour(flight: Flight): Promise<void> {
        const startHour = new Date(flight.date);
        startHour.setMinutes(startHour.getMinutes() - 30);

        const endHour = new Date(flight.date);
        endHour.setMinutes(endHour.getMinutes() + 30);

        const flights = await this.findFlightsBetweenDates(startHour, endHour, flight.id);

        if (flights.length > 0) {
            throw new BadRequestException(
                "Each flight must have at least a 30-minute difference from the other."
            );
        }
    }

    private async validateSameDayDestiny(flight: Flight): Promise<void> {
        const sameDayStart = new Date(flight.date);
        sameDayStart.setHours(0, 0, 0, 0);

        const sameDayEnd = new Date(flight.date);
        sameDayEnd.setHours(23, 59, 59, 999);

        const existingFlights = await this.airportsRepository.find({
            where: {
                destiny: flight.destiny,
                date: Between(sameDayStart, sameDayEnd),
                id: Not(flight.id),
            },
            relations: ['source', 'destiny'],
        });

        if (existingFlights.length > 0) {
            throw new BadRequestException(
                "There cannot be more than one flight to the same destination on the same day."
            );
        }
    }

}
