import { 
  IsEmail, 
  IsNotEmpty, 
  IsString } from "class-validator"

export class CreateUser {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
  
  @IsEmail()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string
}