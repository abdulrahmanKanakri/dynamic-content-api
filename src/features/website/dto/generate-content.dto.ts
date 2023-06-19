import { IsNotEmpty } from 'class-validator';

export class GenerateContentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  targetUser: string;
}
