import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  checkUserSignedIn(req: any, res: Response) {
    if (!req.session.siwe) {
      res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  async getAllUsers(res: Response) {
    res.status(HttpStatus.OK);
    const users = await this.userRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return res.json(users.map(({ address: _, ...user }) => user)); // hide users' addresses
  }

  async getProfile(req: any, res: Response) {
    if (!req.session.siwe) {
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }
    const user = await this.userRepository.findOne({
      where: {
        address: req.session.siwe.address,
      },
    });
    if (user) {
      res.status(HttpStatus.OK);
      res.send(user);
    } else {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }

  async saveUser(req: any, res: Response) {
    if (!req.session.siwe) {
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }
    const newUser = {
      address: req.session.siwe.address,
      name: req.body.name,
      bio: req.body.bio,
      image: req.body.image,
    };

    await this.userRepository.save(newUser);
    res.sendStatus(HttpStatus.CREATED);
    // res.send(newUser);
  }
}
