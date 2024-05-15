import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, LoginUserDto } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminInterface } from './auth.interface';
import { Users } from 'src/utils/entities';
import { comparePasswords, generateOTP, uuidGenerate } from 'src/utils/helpers';
import { User } from 'src/utils/interfaces';
import { From } from 'src/utils/common';

@Injectable()
export class AuthService {
  private readonly userSelectFields = [
    'user.id',
    'user.name',
    'user.slug',
    'user.email',
    'user.phoneNumber',
    'user.image',
    'user.address',
    'user.bio',
  ];
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  // validate admin uing email password
  async validateAdmin(loginData: LoginDto): Promise<AdminInterface> {
    const data = await this.usersRepository
      .createQueryBuilder('user')
      .select([...this.userSelectFields, 'user.password'])
      .where('user.email = :email', { email: loginData.email })
      .getOne();
    if (!data) return null;
    // comapre password
    const verifyPassword = await comparePasswords(
      loginData.password,
      data.password,
    );
    delete data.password;
    if (verifyPassword) return data;
    throw new UnauthorizedException(
      'Invalid credentials, password does not match!',
    );
  }

  // validate user using phone number
  async validateUser(loginData: LoginUserDto): Promise<User> {
    const { name, email, phoneNumber, from } = loginData;
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select([...this.userSelectFields, 'user.loginOTP', 'user.newUser'])
      .where('user.phoneNumber = :phone', { phone: phoneNumber })
      .getOne();
    if (user) {
      // login otp create
      const otp: number = generateOTP(5);

      user.loginOTP = otp;
      user.newUser = false;
      await this.usersRepository.save(user);
      delete user.password;
      delete user.emailVerificationToken;
      delete user.role;
      delete user.updatedAt;

      return user;
    } else {
      // // get role
      // const roleCheck = await this.roleRepository.findOneBy({
      //   name: 'user',
      // });
      // create a new user
      const newUser = new Users();
      newUser.phoneNumber = phoneNumber;
      newUser.from = from as From;
      if (name) newUser.name = name;
      if (email) newUser.email = email;

      // login otp create
      const otp: number = generateOTP(5);
      newUser.loginOTP = otp;
      newUser.newUser = true;
      const createUser = this.usersRepository.create(newUser);
      const res = await this.usersRepository.save(createUser);
      delete res.password;
      delete res.updatedAt;
      delete res.emailVerificationToken;
      delete res.role;

      if (res) return res;
      return null;
    }
  }

  // validate user by using id
  async validateUserById(userId: string): Promise<AdminInterface> {
    const data = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
    if (!data) return null;
    return data;
  }

  // generate token
  async generateToken(user: AdminInterface): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
    };
    const expiresIn = process.env.TOKEN_EXPIRES;

    return this.jwtService.sign(payload, { expiresIn });
  }

  // generate token for geust
  async generateGuestToken(): Promise<string> {
    const payload = {
      userId: await uuidGenerate(),
      email: 'guest@gmail.com',
      role: 'guest',
    };
    const expiresIn = process.env.TOKEN_EXPIRES;
    return this.jwtService.sign(payload, { expiresIn });
  }

  // verify otp
  async verifyOTP(phoneNumber: string, otp: number): Promise<AdminInterface> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select([...this.userSelectFields, 'user.loginOTP', 'user.newUser'])
      .where('user.phoneNumber = :phone', { phone: phoneNumber })
      .getOne();

    if (!user || user.loginOTP !== otp) {
      return null;
    }

    user.phoneNumberVerified = true;
    user.loginOTP = null;
    await this.usersRepository.save(user);
    delete user.password;
    delete user.emailVerificationToken;
    return user;
  }
}
