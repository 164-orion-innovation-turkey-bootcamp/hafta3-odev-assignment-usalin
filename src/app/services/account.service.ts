import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl ='http://localhost:3000/users';

  constructor(private http: HttpClient) {  }

  getUsers() {
    return this.http.get<any>(this.baseUrl).pipe(
      map((data: any[]) => {
        if (data) {
          console.log(data);
          return (data);
        }
        return (null);
      })
    );
  }

  getUsernames(): Observable<string[] | null> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((data: any[]) => {
        if (data) {
          const usernames = data.map(data => data.username);
          console.log(usernames)
          return (usernames);
        }
        return (null);
      }),
      catchError(this.handleError)
    );
  }

  createUser(data: any) {
    const API_URL = this.baseUrl;
    return this.http.post(API_URL, data);
  }

  loginUser(passedData: any) {
    return this.http.get<any>(this.baseUrl).pipe(
      map((data: any[]) => {
        if (data) {
          for (let value of data) {
            if ((passedData.username == value.username) && (passedData.password == value.password)) {
              localStorage.setItem('username', passedData.username);
            }          
          }
          return of(data);
        }
        else return of(null);
      })
    );
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };
}
