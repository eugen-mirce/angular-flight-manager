import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Flight } from '../_models/flight';

@Injectable({
    providedIn: 'root'
})
export class FlightService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getAll(userId: number, tripId: number, page: number, limit: number): Observable<any> {
        return this.http.get(
            `${this.apiUrl}/users/${userId}/trips/${tripId}/flights?page=${page}&limit=${limit}`
        );
    }

    get(userId: number, tripId: number, flightId: number): Observable<Flight> {
        return this.http.get<Flight>(
            `${this.apiUrl}/users/${userId}/trips/${tripId}/flights/${flightId}`
        );
    }
    create(userId: number, tripId: number, data: any): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/users/${userId}/trips/${tripId}/flights`,
            data
        );
    }
    update(
        userId: number,
        tripId: number,
        flightId: number,
        data: any
    ): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/users/${userId}/trips/${tripId}/flights/${flightId}`,
            data
        );
    }
    delete(userId: number, tripId: number, flightId: number): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/users/${userId}/trips/${tripId}/flights/${flightId}`,
            { responseType: 'text' }
        );
    }
}
