import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateObjectDTO {
  @IsString()
  objectId: string;

  @IsString()
  type: string;

  @IsNumber()
  xPos: number;

  @IsNumber()
  yPos: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsString()
  color: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsString()
  creator: string;

  @IsUUID()
  @IsOptional()
  workspaceId: string;
}
