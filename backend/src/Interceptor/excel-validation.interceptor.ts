import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { CustomLogger } from '../utils/Logger/CustomLogger.service';

@Injectable()
export class ExcelValidationInterceptor implements NestInterceptor {
  private readonly logger = new CustomLogger();
  constructor() {}
  private readonly expectedColumns: string[] = [
    'Nom du produit',
    'Matière',
    'Capacité',
    'Couleur',
    'Usage',
  ];
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.xls', '.xlsx'].includes(ext)) {
      throw new BadRequestException('Only Excel files are allowed');
    }

    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const header = json[0];
      if (!header) {
        throw new BadRequestException('Missing header row in the Excel file');
      }
      const isValid = this.expectedColumns.every(
        (col, index) => header[index] === col,
      );

      if (!isValid) {
        throw new BadRequestException(
          `Excel file must have columns: ${this.expectedColumns.join(', ')}`,
        );
      }

      request.excelData = json.slice(1);
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new BadRequestException('Failed to process Excel file', error);
    }
    return next.handle();
  }
}
