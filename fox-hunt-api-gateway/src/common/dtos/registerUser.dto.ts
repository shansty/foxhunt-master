import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty() readonly email: string;
  @IsNotEmpty() readonly password: string;
  @IsNotEmpty() readonly firstName: string;
  @IsNotEmpty() readonly lastName: string;
  @IsNotEmpty() readonly birthDate: string;
  @IsNotEmpty() readonly country: string;
  @IsNotEmpty() readonly city: string;
}
