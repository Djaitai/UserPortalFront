import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpResponse, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Users} from '../models/user';
import {CustomHttpRespone} from '../models/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<Users[] | HttpErrorResponse> {
    return this.http.get<Users[]>(`${this.host}/user/list`);
  }

  public addUser(formData: FormData): Observable<Users | HttpErrorResponse> {
    return this.http.post<Users>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<Users | HttpErrorResponse> {
    return this.http.post<Users>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/resetpassword/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<Users> | HttpErrorResponse> {
    return this.http.post<Users>(`${this.host}/user/updateProfileImage`, formData,
      {reportProgress: true,
        observe: 'events'
      });
  }

  public deleteUser(id: number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/delete/${id}`);
  }

  public addUsersToLocalCache(users: Users[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): Users[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    }
    return null;
  }

  public createUserFormDate(loggedInUsername: string, user: Users, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }
}
