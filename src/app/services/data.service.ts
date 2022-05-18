import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

// Servicio genérico usa el parámetro T
export class DataService<T> {

  private DOMAIN: string = "http://localhost"; //Para incorporar variables de entorno
  private PORT: string = "8080";

  private url: string = `${this.DOMAIN}:${this.PORT}`;
  
  constructor(private http: HttpClient) { }

  public getAll<T>(endPoint: string): Observable<T>{  // En la llamada se especifica el tipo
    return this.http.get<T>(`${this.url}/${endPoint}`);
  }

  public getOne<T>(endPoint: string): Observable<T>{
    return this.http.get<T>(`${this.url}/${endPoint}`);
  }
}