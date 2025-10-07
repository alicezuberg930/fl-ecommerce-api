import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ProductsModule } from '../src/modules/products/products.module';

describe('ProductController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ProductsModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/products (GET)', () => {
        return request(app.getHttpServer())
            .get('/products')
            .expect(200)
        // .expect('Hello World!');
    });
});
