export class CreateBookingDto {
  title!: string;
  description?: string;
  startTime!: Date;
  endTime!: Date;
  userId!: number;
}
