// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs';

// @Injectable()
// export class TransformInterceptor<T> implements NestInterceptor<T, any> {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       map((data) => {
//         // If already shaped (e.g., filters), pass through
//         if (
//           data &&
//           typeof data === 'object' &&
//           Object.prototype.hasOwnProperty.call(data, 'success')
//         )
//           return data;
//         return {
//           success: true,
//           code: 'OK',
//           data,
//           timestamp: new Date().toISOString(),
//         };
//       }),
//     );
//   }
// }
