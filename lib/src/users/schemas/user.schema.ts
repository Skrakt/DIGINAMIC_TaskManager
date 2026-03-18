import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Schema()
export class User {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
    minlength: 8,
  })
  @IsNotEmpty()
  password: string;

  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsNotEmpty()
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
