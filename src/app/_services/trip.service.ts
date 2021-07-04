import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trip } from '../_models/trip';
import { Flight } from '../_models/flight';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAll(userId: number, page: number, limit: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/users/${userId}/trips?page=${page}&limit=${limit}`);
    }
    get(userId: number, tripId: number): Observable<Trip> {
        return this.http.get<Trip>(`${this.apiUrl}/users/${userId}/trips/${tripId}`);
    }
    create(userId: number, data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/users/${userId}/trips`, data);
    }
    update(userId: number, tripId: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${userId}/trips/${tripId}`, data);
    }
    delete(userId: number, tripId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${userId}/trips/${tripId}`, { responseType: 'text' });
    }
    requestApproval(userId: number, tripId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/users/${userId}/trips/${tripId}/request_approval`, {});
    }
}
