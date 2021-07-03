import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  observe: 'response' as 'response',
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any[]> {
    return this.http.get<any[]>(`{this.apiUrl}/users`);
  }

  public get(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  public update(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, data);
  }

  public delete(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { responseType: "text" });
  }

  public login(email: String, password: String): any {
    return this.http.post(`${this.apiUrl}/users/login`, { "email": email, "password": password }, httpOptions);
  }
}
