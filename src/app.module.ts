// common
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { IpWhitelistMiddleware } from './common/middleware/ip.whitelist'
// providers
import { JwtAuthGuard } from './modules/auth/passport/jwt-auth.guard'
import { AllExceptionsFilter } from './common/exceptions/exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AppService } from './app.service'
// mail
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
// modules
import { AppController } from './app.controller'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { BannersModule } from './modules/banners/banners.module'
import { FileModule } from './modules/files/file.module'
import { InformationModule } from './modules/information/information.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { BrandModule } from './modules/brands/brands.module'
import { ProductsModule } from './modules/products/products.module'
import { RatingModule } from './modules/ratings/ratings.module'
import { CartsModule } from './modules/carts/carts.module'
import { LocationModule } from './modules/locations/locations.module'
import { OrdersModule } from './modules/orders/orders.module'
import { MongooseModule } from '@nestjs/mongoose'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  imports: [
    UsersModule,
    AuthModule,
    InformationModule,
    BannersModule,
    CategoriesModule,
    FileModule,
    BrandModule,
    ProductsModule,
    RatingModule,
    CartsModule,
    LocationModule,
    OrdersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // e-mail config module
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: true,
          // logger: true,
          // debug: true,
          auth: {
            user: configService.get<string>('MAIL_USERNAME'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false
          }
        },
        defaults: {
          from: '"No Reply" <no-reply@future-life>',
        },
        template: {
          dir: process.cwd() + '/src/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          }
        },
      }),
      inject: [ConfigService],
    }),
    // mongo db config module
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpWhitelistMiddleware).forRoutes('*')
  }
}