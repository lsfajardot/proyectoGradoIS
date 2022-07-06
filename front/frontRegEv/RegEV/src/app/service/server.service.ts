import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Type } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  servers$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  save$ = (server: Server) =>
     {  console.log('save')

    console.log(server)
     console.log(`${this.apiUrl}/server/save`)
    return this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
    }
  ping$ = (ipAddress: string) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  filter$ = (type: Type, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      suscriber => {
        console.log(response);
        suscriber.next(
          type === Type.ALL ? { ...response, message: `Servers filtered by ${type} status` } :
            {
              ...response,
              message: response.data.servers
                .filter(server => server.tipo === type).length > 0 ? `Servers filtered by
          ${type === Type.COSQUILLEO ? 'SERVER UP'
                : 'SERVER DOWN'} status` : `No servers of ${type} found`,
              data: {
                servers: response.data.servers
                  .filter(server => server.tipo === type)
              }
            }
        );
        suscriber.complete();
      }
    )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  delete$ = (serverId: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
