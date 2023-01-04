> NestJS本身提供[拦截器](https://docs.nestjs.cn/9/interceptors?id=%e5%9f%ba%e7%a1%80)，我们使用最基础的 **map** 操作即可实现返回值的拦截


### 创建返回值拦截器文件 **01/src/utils/interceptors/response.ts**


```javascript
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
```
map 操作可以将返回值进行转换，这里我们将返回值转换为统一的格式，方便前端处理。

其中，我们将文件流直接返回，不做处理，因为文件流的返回格式和我们定义的格式不一致，否则前端无法直接下载文件。

### 修改 **01/src/app.controller.ts**
    
```javascript
+-  import { Controller, Get, UseInterceptors } from '@nestjs/common';
    import { AppService } from './app.service';
+   import { ResponseInterceptor } from './utils/interceptors/response';

    @Controller()
+   @UseInterceptors(ResponseInterceptor)
    export class AppController {
      constructor(private readonly appService: AppService) {}
    
      @Get()
      getHello(): string {
        return this.appService.getHello();
      }
    }

```

将拦截器添加到 **AppController** 上，这样所有的请求都会经过拦截器，返回值都会被转换为统一的格式。
