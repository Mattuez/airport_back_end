import { IsNotEmpty, IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateFlightDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsUUID('4')
    source_id: string;

    @IsNotEmpty()
    @IsUUID('4')
    destiny_id: string;
}
