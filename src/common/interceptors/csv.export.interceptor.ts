import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { extractRequest } from 'nest-keycloak-connect/util';
import { Options, parse } from 'json2csv';

@Injectable()
export class CsvExportInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [req, res] = extractRequest(context);
    const accept = req.headers['accept'];
    if (accept && accept.indexOf('text/csv') !== -1) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-disposition', 'attachment; filename=export.csv');
      if (req.query.limit) {
        delete req.query.limit;
      }
      if (req.query.offset) {
        delete req.query.offset;
      }
      return next.handle().pipe(
        map((resp) => {
          return CsvExportInterceptor.convertToCsv(resp.data);
        }),
      );
    }

    return next.handle();
  }

  private static convertToCsv(data: any): any {
    console.log('converting to CSV');
    const options: Options<any> = {
      fields: CsvExportInterceptor.renderObjects(data),
    };
    return parse(data, options);
  }

  private static renderObjects(obj: any): any {
    if (!obj || (Array.isArray(obj) && obj.length === 0)) {
      return null;
    }
    let tempObj = obj;
    if (Array.isArray(tempObj) && tempObj.length > 0) {
      tempObj = obj[0];
    }
    return Object.keys(tempObj).map((key: string) => {
      return { label: key, value: key };
    });
  }
}
