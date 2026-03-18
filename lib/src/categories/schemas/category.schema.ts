import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../users/schemas/user.schema";
import { IsNotEmpty } from "class-validator";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Category {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  @IsNotEmpty()
  authorId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    select: false,
    maxlength: 100,
  })
  @IsNotEmpty()
  normalizedName: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ authorId: 1, normalizedName: 1 }, { unique: true });
