import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Between, LessThanOrEqual, MoreThanOrEqual, Not, Repository} from 'typeorm';
import { Flight } from './flight';

@Injectable()
export class FlightService {
    constructor(
        @InjectRepository(Flight)
        private flightRepository: Repository<Flight>,
    ) {}

    findAll(): Promise<Flight[]> {
        return this.flightRepository.find({ relations: ['source', 'destiny'] });
    }

    async findOne(id: string): Promise<Flight> {
        const airport = await this.flightRepository.findOne({ where: { id: id }, relations: ['source', 'destiny'] });

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

        return this.flightRepository.save(flight);
    }

    async update(id: string, updatedFlight: Flight): Promise<Flight> {
        const existingFlight = await this.findOne(id);

        if (!existingFlight) {
            throw new NotFoundException(`Flight with ID ${id} not found`);
        }

        existingFlight.source = updatedFlight.source;
        existingFlight.destiny = updatedFlight.destiny;
        existingFlight.date = updatedFlight.date;

        existingFlight.validateLocations();

        await Promise.all([
            this.validateFlightHour(existingFlight),
            this.validateSameDayDestiny(existingFlight)
        ]);

        return this.flightRepository.save(existingFlight);
    }


    async remove(id: string): Promise<void> {
        const airport = await this.findOne(id);

        await this.flightRepository.delete(airport.id)
    }

    async findFlightsBetweenDates(startDate: Date, endDate: Date, flightId: string): Promise<Flight[]> {
        const flights = await this.flightRepository.find({
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

        const existingFlights = await this.flightRepository.find({
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
