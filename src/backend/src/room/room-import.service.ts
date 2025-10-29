import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RoomImportService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async importRoomsFromCSV(): Promise<Room[]> {
    const csvPath = path.join(process.cwd(), '..', '..', 'data', 'uvic_rooms.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    
    // Skip header line
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    const rooms: Room[] = [];
    
    for (const line of dataLines) {
      // Handle CSV parsing more carefully - split by comma but handle quoted fields
      const fields = this.parseCSVLine(line);
      
      if (fields.length < 3) {
        continue; // Skip invalid rows
      }
      
      const [name, building, capacity, avEquipment, location, url] = fields;
      
      if (!name || !capacity) {
        continue; // Skip invalid rows
      }
      
      // Extract building name from location field
      let buildingName = building.trim();
      if (location && location.includes('of the ')) {
        buildingName = location.replace('of the ', '').trim();
      }
      
      const room = new Room();
      room.name = name.trim();
      room.building = buildingName;
      room.capacity = parseInt(capacity.trim(), 10);
      room.avEquipment = avEquipment?.trim() ? [avEquipment.trim()] : [];
      room.location = location?.trim() || undefined;
      room.url = url?.trim() || undefined;
      room.isActive = true;
      
      rooms.push(room);
    }
    
    // Insert new rooms one by one to handle duplicates gracefully
    const savedRooms: Room[] = [];
    for (const room of rooms) {
      try {
        const savedRoom = await this.roomRepository.save(room);
        savedRooms.push(savedRoom);
      } catch (error: any) {
        if (error.code === '23505') {
          // Duplicate key error - skip this room
          console.log(`Skipping duplicate room: ${room.name} in ${room.building}`);
          continue;
        }
        throw error;
      }
    }
    return savedRooms;
  }

  async getRoomCount(): Promise<number> {
    return await this.roomRepository.count();
  }

  private parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    fields.push(current.trim());
    return fields;
  }
}
