import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get, NotFoundException,
  Param,
  Post,
  Put, UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { User } from './user.entity'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { EntityId } from 'typeorm/repository/EntityId'
import { plainToClass } from 'class-transformer'
import { UpdateUserDto } from './dto/update-user.dto'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  index(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get('/inactive')
  getInactiveUser(): Promise<User[]> {
    return this.userService.getInactiveUsers()
  }

  @Get('/:id')
  async show(@Param('id') id: EntityId): Promise<User> {
    const user = await this.userService.findById(id)
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  @Post()
  async create(@Body() userData: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.store(userData)

    return plainToClass(User, createdUser)
  }

  @Put('/:id')
  update(@Param('id') id: EntityId, @Body() userData: UpdateUserDto): Promise<User> {
    return this.userService.update(id, userData)
  }
}
