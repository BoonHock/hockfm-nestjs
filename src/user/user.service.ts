import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOrCreateUser(user: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = this.userRepository.create({
      ...user,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async findUserById(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
