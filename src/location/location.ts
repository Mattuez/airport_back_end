// src/locations/location.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuidv4} from "uuid";

@Entity()
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column({ nullable: false })
    cep: string;

    @Column({ nullable: false })
    city: string;

    @Column({ nullable: false })
    state: string;


    constructor(cep: string, city: string, state: string) {
        this.cep = cep;
        this.city = city;
        this.state = state;
    }
}
