import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './modules/users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/passport/jwt-auth.guard'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/exceptions/exception.filter'
import { PostsModule } from './modules/posts/posts.module'
import { BannersModule } from './modules/banners/banners.module'
import { FileModule } from './modules/files/file.module'
import { InformationModule } from './modules/information/information.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { IpWhitelistMiddleware } from './common/middleware/ip.whitelist'
import { BrandModule } from './modules/brands/brands.module'
import { ProductsModule } from './modules/products/products.module'
import { RatingModule } from './modules/ratings/ratings.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { CartsModule } from './modules/carts/carts.module'
import { LocationModule } from './modules/locations/locations.module'

@Module({
  imports: [
    UsersModule,
    AuthModule,
    InformationModule,
    PostsModule,
    BannersModule,
    CategoriesModule,
    FileModule,
    BrandModule,
    ProductsModule,
    RatingModule,
    CartsModule,
    LocationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // e-mail config module
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USERNAME'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
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