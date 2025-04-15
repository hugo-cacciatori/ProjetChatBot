import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GeneratedRequestService } from '../generated-request/generated-request.service';
import { TagService } from '../tag/tag.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @Inject(forwardRef(() => GeneratedRequestService))
    private readonly generatedRequestService: GeneratedRequestService,

    private readonly tagService: TagService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        return await this.productRepository.findOne({
          where: { name: createProductDto.name },
        });
      }
      this.handleServerError(
        error,
        'An error occurred while creating a product',
      );
    }
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository
      .find({
        relations: {
          request: true,
          tags: true,
        },
      })
      .catch((error) => {
        throw this.handleServerError(
          'An error occured while retrieving products',
          error,
        );
      });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository
      .findOne({
        where: {
          id,
        },
        relations: {
          request: true,
          tags: true,
        },
      })
      .catch((error) => {
        throw this.handleServerError(
          `An error occured while finding product with id ${id}`,
          error,
        );
      });

    if (!product) {
      throw this.handleNotFoundError(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, productDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        request: true,
        tags: true,
      },
    });

    if (!product) {
      throw this.handleNotFoundError(`Product with id ${id} not found`);
    }

    if (productDto.name) {
      product.name = productDto.name;
    }

    if (productDto.description) {
      product.description = productDto.description;
    }

    return await this.updateRelations(product, productDto).catch((error) => {
      throw this.handleServerError(
        `An error occured while updating product with id ${id}`,
        error,
      );
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id).catch((error) => {
      throw this.handleServerError(
        `An error occured while deleting product with id ${id}`,
        error,
      );
    });

    if (result.affected <= 0) {
      throw this.handleNotFoundError(`Product with id ${id} not found`);
    }
  }

  private async updateRelations(
    product: Product,
    productDto: UpdateProductDto,
  ): Promise<Product> {
    if (productDto.requestId) {
      product.request = await this.generatedRequestService.findOne(
        productDto.requestId,
      );
    }

    if (productDto.tagIds) {
      product.tags = await Promise.all(
        productDto.tagIds.map((tagId) => this.tagService.findOne(tagId)),
      );
    }

    return this.productRepository.save(product);
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
