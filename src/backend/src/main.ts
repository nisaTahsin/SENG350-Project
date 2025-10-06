import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoomImportService } from './room/room-import.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
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
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
