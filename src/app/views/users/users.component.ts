import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Users} from '../../models/user';
import {NotificationType} from '../../enum/notification-type.enum';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import {AuthenticationService} from '../../service/authentication.service';
import {NotificationService} from '../../service/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: Users[];
  public refreshing: boolean;
  private subscriptions: Subscription[] = [];
  public selectedUser: Users;

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.getUsers(true);
  }
  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: Users[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  public onSelectUser(selectedUser: Users): void {
    this.selectedUser = selectedUser;
    // this.clickButton('openUserInfo');
    document.getElementById('openUserInfo').click();
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }


}
