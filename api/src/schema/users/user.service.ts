import { PaginatedResponseDto } from '../patients/dto/pagination-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model, QueryFilter, UpdateWriteOpResult } from 'mongoose';
import { hash } from 'node:crypto';
import { verify } from 'otplib';

const SALT_ROUND = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (createUserDto.totpSecret) {
      const result = await verify({
        token: createUserDto.totpCode,
        secret: createUserDto.totpSecret,

        // Accept tokens that are at max 30 seconds old.
        // Reject tokens that are older than 30 seconds, or newer than the current time.
        epochTolerance: [30, 0],
      });

      if (!result.valid) {
        throw new BadRequestException('Invalid TOTP code');
      }
    }

    const password = await bcrypt.hash(
      // Reduce the length to < 72 bytes
      hash('sha512', createUserDto.password, { outputEncoding: 'buffer' }),
      SALT_ROUND,
    );

    // eslint-disable-next-line @typescript-eslint/no-misused-spread
    return this.userModel.create({ ...createUserDto, password });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ _id: 1 }).exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findOneUserNameForAuth(userName: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ userName: userName }).exec();
  }

  async findNurses(): Promise<UserDocument[]> {
    return this.userModel
      .find({ group: 'nurse', status: 'active' }, 'firstName lastName')
      .exec();
  }

  async findPageByFilter(
    numberOfRows: number,
    pageNumber: number,
    filter: string,
    search: string,
  ): Promise<PaginatedResponseDto<UserDocument>> {
    const searchFilter: Record<string, unknown> = {};

    if (filter && search) {
      const escapedValue = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

      searchFilter[filter] = {
        $regex: escapedValue,
        $options: 'i',
      };
    }

    const query = searchFilter as QueryFilter<UserDocument>;

    interface UserAggregateResult {
      data: UserDocument[];
      total: number;
    }

    const [result] = await this.userModel
      .aggregate<UserAggregateResult>([
        { $match: query },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            paginatedResults: [
              { $sort: { status: -1 } },
              { $skip: (pageNumber - 1) * numberOfRows },
              { $limit: numberOfRows },
            ],
          },
        },
        {
          $project: {
            data: '$paginatedResults',
            total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
          },
        },
      ])
      .exec();

    const rawData = result?.data ?? [];
    const total = result?.total ?? 0;

    // rehydrate the raw objects into full Mongoose documents, to allow contorller to add _id
    const data = rawData.map((doc) => this.userModel.hydrate(doc));

    const totalFilteredDocuments = total;
    const totalPages = Math.ceil(totalFilteredDocuments / numberOfRows);

    return {
      data: data,
      meta: {
        totalPages,
      },
    };
  }

  async findPage(
    numberOfRows: number,
    pageNumber: number,
  ): Promise<PaginatedResponseDto<UserDocument>> {
    const docs = await this.userModel
      .find()
      .sort({ userName: 'asc' })
      .skip((pageNumber - 1) * numberOfRows)
      .limit(numberOfRows)
      .exec();

    const totalDocuments = await this.userModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / numberOfRows);

    return {
      data: docs,
      meta: {
        totalPages,
      },
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateWriteOpResult> {
    if (updateUserDto.totpSecret) {
      const result = await verify({
        token: updateUserDto.totpCode ?? '',
        secret: updateUserDto.totpSecret,

        // Accept tokens that are at max 30 seconds old.
        // Reject tokens that are older than 30 seconds, or newer than the current time.
        epochTolerance: [30, 0],
      });

      if (!result.valid) {
        throw new BadRequestException('Invalid TOTP code');
      }
    }

    let password = updateUserDto.password;
    if (password !== undefined) {
      password = await bcrypt.hash(
        // Reduce the length to < 72 bytes
        hash('sha512', password, { outputEncoding: 'buffer' }),
        SALT_ROUND,
      );
    }

    return this.userModel
      .updateOne(
        { _id: id },
        {
          // eslint-disable-next-line @typescript-eslint/no-misused-spread
          $set: { ...updateUserDto, password },
        },
      )
      .exec();
  }
}
