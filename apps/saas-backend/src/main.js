"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Global prefix for all routes
    app.setGlobalPrefix('api');
    // Enable URI versioning (e.g., /api/v1/...)
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    // Global pipes and configuration
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    // CORS configuration
    app.enableCors({
        origin: process.env.CORS_ORIGIN || [
            'http://localhost:3001',
            'http://localhost:3002',
        ],
        credentials: true,
    });
    // Start the server
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
