import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class EditPostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
