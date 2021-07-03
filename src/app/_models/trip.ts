import { Flight } from '../_models/flight';
export class Trip {
  id?: number;
  reason?: string;
  description?: string;
  from?: string;
  to?: string;
  departureDate?: string;
  arrivalDate?: string;
  flights?: Flight[];
  status?: string;
}
