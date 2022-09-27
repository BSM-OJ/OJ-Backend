import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:3001',
        credentials: true
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    );
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    await app.listen(process.env.APP_PORT);
}
bootstrap();
