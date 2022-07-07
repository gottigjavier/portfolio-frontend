import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/auth-sevices/login.service';
import { PopupBindingService } from 'src/app/services/binding-services/popup-binding.service';
import { DataService } from 'src/app/services/data-services/data.service';

declare var $ : any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent<T> implements OnInit {
  
    
    public user: User;
    public userList: Array<User>=[];
    private endPoint: string= "user/list";
    public userRoleUser: string="";
    public userRoleAdmin: string="";
    
  
    constructor(
      private dataService: DataService<T>,
      private popupBindingService: PopupBindingService<User>,
      private loginService: LoginService,
      private routes: Router
    ) {
      this.user={
        userId: 0,
        userName: "",
        email: "",
        password: "",
        authorities: [
          {"authority": ""},
          {"authority": ""}
        ]
      }
    }
  
    ngOnInit(): void {
      if (sessionStorage.getItem('currentUser')){
        this.user= this.loginService.authenticatedUser;
        console.log("user on user component ", this.user);
        if(this.loginService.authenticatedUser.authorities.length>0){
          this.userRoleUser= this.loginService.authenticatedUser.authorities[0].authority;
        }
        if(this.loginService.authenticatedUser.authorities.length>1){
          this.userRoleAdmin= this.loginService.authenticatedUser.authorities[1].authority;
        }
      }
      console.log("roleuser on user component ", this.userRoleUser);
      console.log("roleadmin on user component ", this.userRoleAdmin);
    }

    changePass(){
      
    }

    createUser(){
      $("#newUser").modal("show");
    }

    deleteUser(){
      
    }

    onClose(){
      this.routes.navigate(['/']);
    }
  
    openEdit(){
      this.popupBinding<User>(this.user);
      $("#editUser").modal("show");
    }
    
    popupBinding<T>(data: T){
      this.popupBindingService.setData<T>(data);
    }
  
  
  }
  