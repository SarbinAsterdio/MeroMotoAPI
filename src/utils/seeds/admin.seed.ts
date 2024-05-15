// import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { encryptPassword } from '../helpers/bcrypt-password';
import { UserRole } from '../common';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectRepository(Users)
    private adminRepository: Repository<Users>,
  ) {}

  async seed() {
    // Check if admin data already exists
    const adminCount = await this.adminRepository.count();
    if (adminCount > 0) {
      return;
    }

    // Insert admin data
    const adminData = {
      name: 'Mero Moto',
      email: 'meromoto@gmail.com',
      phoneNumber: '9860536317',
      password: await encryptPassword('mero@moto2023'), // Encrypt the password using encryptPassword
      role: UserRole.Admin,
      emailVerified: true,
      phoneNumberVerified: true,
    };

    const admins = this.adminRepository.create(adminData);
    await this.adminRepository.save(admins);
  }
}
