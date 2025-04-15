import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailService } from 'src/core/mail/mailer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rol } from '../rol/entity/rol.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let mailService: MailService;

  const mockUserService = {
    createUser: jest.fn(),
    verifyUser: jest.fn(),
    validateUser: jest.fn(),
    getUserById: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token')
  };

  const mockMailService = {
    sendMail: jest.fn().mockResolvedValue(true)
  };

  const mockRolRepository = {
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: MailService,
          useValue: mockMailService
        },
        {
          provide: getRepositoryToken(Rol),
          useValue: mockRolRepository
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and send verification email', async () => {
      const mockUser = {
        cre_profilePhoto: new Blob(['']) as Blob,
        cre_email: " Usuario@ejemplo000.com ",
        cre_rol: 1,
        cre_isVerified: true,
        cre_codeVerify: "1234f",
        cre_password: "contraseña123",
        people: {
        cre_name: "Juan",
        cre_lastname: "Pérez",
        cre_birthdate: new Date('1990-01-01'),
        cre_typeDni: 1,
        cre_dni: "12345600",
        cre_phone: "987654321",
        cre_createdAt: new Date(),
        }
        }

      mockUserService.createUser.mockResolvedValue(mockUser);

      const result = await service.register(mockUser);

      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUser);
      expect(mockMailService.sendMail).toHaveBeenCalled();
      expect(result.message[0]).toBe('usuario registrado se enviara un correo con su verificacion');
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        rol: { name: 'user' }
      };

      mockUserService.validateUser.mockResolvedValue(mockUser);

      const result = await service.login('test@test.com', 'password123');

      expect(mockUserService.validateUser).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(result).toHaveProperty('access_token');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserService.validateUser.mockRejectedValue(new UnauthorizedException());

      await expect(service.login('wrong@email.com', 'wrongpass'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('profile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com'
      };

      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await service.profile(1);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });
});