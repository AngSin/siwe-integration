import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from './user/user.module';
import { SignatureModule } from './signature/signature.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    SignatureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
