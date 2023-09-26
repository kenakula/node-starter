import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateDefaultDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  public name: string;
  public isActive: boolean;
  public date: Date;
}
