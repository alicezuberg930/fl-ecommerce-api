import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RESPONSE_MESSAGE } from "../decorators/public.decorator";

export interface Response<T> {
    statusCode: number
    message?: string
    data: T,
    paginate?: {
        totalPages?: number;
        pageSize?: number;
        currentPage?: number;
    }
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
        return next.handle().pipe(
            map((response) => {
                const statusCode = context.switchToHttp().getResponse().statusCode
                const message = this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler())
                if (response && typeof response === 'object' && 'data' in response && 'paginate' in response) {
                    return {
                        statusCode,
                        message,
                        data: response.data as T,
                        paginate: response.paginate
                    }
                }
                return {
                    statusCode,
                    message,
                    data: response as T,
                }
            })
        )
    }
}