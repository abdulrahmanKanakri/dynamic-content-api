import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

interface ResponseMetadata {
  success: boolean;
  message: string;
}

@Injectable()
export class APITransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const metadata = this.getResponseMetadata(ctx.getResponse());
    return next.handle().pipe(map((data) => ({ ...metadata, data })));
  }

  private getResponseMetadata(response: any): ResponseMetadata {
    let success = true;
    let message = '';

    if (response.statusCode >= 400) {
      success = false;
    }

    switch (response.statusCode) {
      case 200:
        message = 'Successfully processed';
        break;
      case 201:
        message = 'Successfully created';
        break;
      case 201:
        message = 'Successfully created';
        break;
      case 401:
        message = 'Unauthorized';
        break;
      case 403:
        message = 'Forbidden';
        break;
      case 404:
        message = 'Not found';
        break;
      case 400:
      case 500:
        message = 'Error while processing the request';
        break;
    }

    return { success, message };
  }
}
