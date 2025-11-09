import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoomImportService } from './room/room-import.service';
import { AppDataSource } from './data-source';



async function bootstrap() {
  // Initialize TypeORM DataSource FIRST
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log(' Data Source has been initialized!');
  }

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',  // React frontend
      'http://localhost:4000',  // Backend
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  // Auto-import rooms on startup if database is empty
  const roomImportService = app.get(RoomImportService);
  const roomCount = await roomImportService.getRoomCount();
  
  if (roomCount === 0) {
    console.log('No rooms found in database. Importing from CSV...');
    try {
      const rooms = await roomImportService.importRoomsFromCSV();
      console.log(`Successfully imported ${rooms.length} rooms on startup`);
    } catch (error) {
      console.error('Failed to import rooms on startup:', error);
    }
  } else {
    console.log(`Database already contains ${roomCount} rooms`);
  }
  
  await app.listen(4000, '0.0.0.0'); // Listen on port 4000
  console.log('Backend server running on http://localhost:4000');
}
bootstrap();