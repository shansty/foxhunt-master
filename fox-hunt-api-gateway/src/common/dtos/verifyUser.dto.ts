import { IsNotEmpty } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty() readonly id: number;
  @IsNotEmpty() readonly token: string;
}
