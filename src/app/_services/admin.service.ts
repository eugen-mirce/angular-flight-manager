import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Trip } from '../_models/trip';
import { Flight } from '../_models/flight';
import { Observable } from 'rxjs';

const httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUser(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/users/${id}`);
    }
    getUsers(page: number, limit: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/users?page=${page}&limit=${limit}`);
    }
    createUser(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, data);
    }
    updateUser(id: number, data: any): Observable<any> {
        data.roles = [data.roles];
        return this.http.put(`${this.apiUrl}/users/${id}`, data);
    }
    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' });
    }

    getAllTrips(selector: string, page: number, limit: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/trips?status=${selector}&page=${page}&limit=${limit}`);
    }
    getTrip(tripId: number): Observable<Trip> {
        return this.http.get<Trip>(`${this.apiUrl}/trips/${tripId}`);
    }
    getTripFlights(tripId: number, page: number, limit: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/trips/${tripId}/flights?page=${page}&limit=${limit}`);
    }
    approveTrip(tripId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/trips/${tripId}/status/approved`, {});
    }
    updateTrip(tripId: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/trips/${tripId}`, data);
    }
    deleteTrip(tripId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/trips/${tripId}`, { responseType: 'text' });
    }
    getAllFlights(page: number, limit: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/flights?page=${page}&limit=${limit}`);
    }
    getFlight(flightId: number): Observable<Flight> {
        return this.http.get<Flight>(`${this.apiUrl}/flights/${flightId}`);
    }
    updateFlight(flightId: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/flights/${flightId}`, data);
    }
    deleteFlight(flightId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/flights/${flightId}`, { responseType: 'text' });
    }
}