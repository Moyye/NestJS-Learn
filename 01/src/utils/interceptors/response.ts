import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  // 返回的数据
  data: T;
  // 错误信息
  error?: string;
  // 用于前端展示的错误信息
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(__: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果是文件流，直接返回
        if (data instanceof StreamableFile) {
          return data as any;
        }

        return {
          data,
          error: '',
          message: 'success',
        };
      }),
    );
  }
}
