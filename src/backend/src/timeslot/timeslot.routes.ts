import { Router } from 'express';

const router = Router();

interface Timeslot {
  id: number;
  roomId: number;
  startTime: string;
  endTime: string;
}

let timeslots: Timeslot[] = [];
let nextId = 1;

// GET all timeslots
router.get('/', (req, res) => {
  res.json(timeslots);
});

// POST new timeslot
router.post('/', (req, res) => {
  const { roomId, startTime, endTime } = req.body;

  if (!roomId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newSlot: Timeslot = { id: nextId++, roomId, startTime, endTime };
  timeslots.push(newSlot);
  res.status(201).json(newSlot);
});

// DELETE a timeslot
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  timeslots = timeslots.filter(slot => slot.id !== id);
  res.json({ message: 'Timeslot deleted' });
});

export default router;
