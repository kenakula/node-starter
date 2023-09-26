import {
  IsBoolean,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateDefaultDTO {
  @IsBoolean()
  public isActive: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  public name: string;
}
