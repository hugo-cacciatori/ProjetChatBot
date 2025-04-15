import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const result = await this.tagRepository.upsert(createTagDto, ['name']);
      const id = result.identifiers?.[0]?.id;
      return await this.tagRepository.findOneByOrFail({ id });
    } catch (error) {
      this.logger.error('Tag creation failed:', error);
      throw this.handleServerError(
        'An error occurred while upserting a tag',
        error,
      );
    }
  }
  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find().catch((error) => {
      throw this.handleServerError(
        'An error occured while retrieving tags',
        error,
      );
    });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository
      .findOneBy({
        id,
      })
      .catch((error) => {
        throw this.handleServerError(
          `An error occured while finding tag with id ${id}`,
          error,
        );
      });

    if (!tag) {
      throw this.handleNotFoundError(`Tag with id ${id} not found`);
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<void> {
    const result = await this.tagRepository
      .update(id, updateTagDto)
      .catch((error) => {
        throw this.handleServerError(
          `An error occured while updating tag with id ${id}`,
          error,
        );
      });

    if (result.affected <= 0) {
      throw this.handleNotFoundError(`Tag with id ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id).catch((error) => {
      throw this.handleServerError(
        `An error occured while deleting tag with id ${id}`,
        error,
      );
    });

    if (result.affected <= 0) {
      throw this.handleNotFoundError(`Tag with id ${id} not found`);
    }
  }

  private handleServerError(
    message: string,
    error: any,
  ): InternalServerErrorException {
    this.logger.error(message, error);
    return new InternalServerErrorException(message, error);
  }

  private handleNotFoundError(message: string): NotFoundException {
    this.logger.warn(message);
    return new NotFoundException(message);
  }
}
