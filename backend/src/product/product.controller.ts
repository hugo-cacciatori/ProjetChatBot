import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomLogger } from 'src/utils/Logger/CustomLogger.service';

@Controller('product')
export class ProductController {
  private readonly logger = new CustomLogger();
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    try {
      this.logger.log(
        `Creating new product with name: ${createProductDto.name}`,
      );
      return this.productService.create(createProductDto);
    } catch (error) {
      this.logger.error(
        `Error creating product with name: ${createProductDto.name}`,
        error,
      );
      throw error;
    }
  }

  @Get()
  findAll() {
    this.logger.log('Fetching all products');
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      this.logger.log(`Updating product with id: ${id}`);
      return this.productService.update(+id, updateProductDto);
    } catch (error) {
      this.logger.error(`Error updating product with id: ${id}`, error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting product with id: ${id}`);
      return this.productService.remove(+id);
    } catch (error) {
      this.logger.error(`Error deleting product with id: ${id}`, error);
      throw error;
    }
  }
}
