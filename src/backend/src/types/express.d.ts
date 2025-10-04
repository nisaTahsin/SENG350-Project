// src/types/express.d.ts
import { User } from '../../user/user.entity'; 
// OR, if you want to use your booking user interface:
// import { IUser } from '../../booking/booking.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // or IUser if that's what you use in auth
    }
  }
}
