import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UsersResponse } from './user.types';
import { SignatureService } from '../signature/signature.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private signatureService: SignatureService,
  ) {}

  async getAllUsers(): Promise<UsersResponse> {
    const users = await this.userRepository.find();
    return users.map(({ address: _, ...user }) => user); // hide users' addresses
  }

  async getProfile(req: any): Promise<User | null> {
    this.signatureService.checkSiweSession(req);
    return await this.userRepository.findOne({
      where: {
        address: req.session.siwe.address,
      },
    });
  }

  async saveUser(req: any): Promise<User> {
    this.signatureService.checkSiweSession(req);
    const newUser = {
      address: req.session.siwe.address,
      name: req.body.name,
      bio: req.body.bio,
      image: req.body.image,
    };

    return await this.userRepository.save(newUser);
  }
}
