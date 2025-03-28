import {
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

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly generatedRequestService: GeneratedRequestService,
  ) { }

  async create({
    name,
    description,
    requestId,
  }: CreateProductDto): Promise<Product> {
    const request = await this.generatedRequestService.findOne(requestId);

    try {
      const product = this.productRepository.create({
        name,
        description,
        request,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      throw this.handleServerError(
        'An error occcured while creating a product',
        error,
      );
    }
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find().catch((error) => {
      throw this.handleServerError(
        'An error occured while retrieving products',
        error,
      );
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository
      .findOneBy({
        id,
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

  async update(
    id: number,
    { name, description, requestId }: UpdateProductDto,
  ): Promise<void> {
    const request = await this.generatedRequestService.findOne(requestId);

    const result = await this.productRepository
      .update(id, {
        name,
        description,
        request,
      })
      .catch((error) => {
        throw this.handleServerError(
          `An error occured while updating product with id ${id}`,
          error,
        );
      });

    if (result.affected <= 0) {
      throw this.handleNotFoundError(`Product with id ${id} not found`);
    }
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
