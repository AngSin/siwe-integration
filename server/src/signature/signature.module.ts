import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';

@Module({
  imports: [],
  controllers: [SignatureController],
  providers: [SignatureService],
})
export class SignatureModule {}
