import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Location } from '../location/location';
import { v4 as uuidv4 } from 'uuid';
import {BadRequestException} from "@nestjs/common";

@Entity()
export class Flight {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @ManyToOne(() => Location, { nullable: false })
    source: Location;

    @ManyToOne(() => Location, { nullable: false })
    destiny: Location;

    @Column({ type: 'timestamp', nullable: false })
    date: Date;


    constructor(source: Location, destiny: Location, date: Date) {
        this.source = source;
        this.destiny = destiny;
        this.date = date;
    }

    validateLocations() {
        if (this.source.id === this.destiny.id) {
            throw new BadRequestException('Source and destiny must be different locations.');
        }
    }
}
