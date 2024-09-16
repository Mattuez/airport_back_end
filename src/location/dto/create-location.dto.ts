import { IsNotEmpty, Matches } from 'class-validator';

export class CreateLocationDto {
    @IsNotEmpty()
    @Matches(/^\d{5}-\d{3}$/, { message: 'CEP deve estar no formato 12345-678' })
    cep: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    state: string;
}
