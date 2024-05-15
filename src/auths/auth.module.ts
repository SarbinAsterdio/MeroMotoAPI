import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserJwtStrategy } from './guard/user.strategy';
import { AdminJwtStrategy } from './guard/admin.strategy';
import { VendorJwtStrategy } from './guard/vendor.strategy';

import { Users } from 'src/utils/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // own secret key
      signOptions: { expiresIn: '24h' }, // Set the token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [
    AdminJwtStrategy,
    UserJwtStrategy,
    VendorJwtStrategy,
    AuthService,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
