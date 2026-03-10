import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  create(data: Pick<User, 'name' | 'email' | 'password'>) {
    return this.userModel.create(data);
  }

  findById(userId: string) {
    return this.userModel.findById(new Types.ObjectId(userId)).exec();
  }

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(new Types.ObjectId(userId))
      .select('-password')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
