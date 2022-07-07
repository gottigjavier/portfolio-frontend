import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserCreateModule } from './user-create/user-create.module';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    UserCreateModule,
    SharedModule
  ],
  exports: [
    UserComponent
  ]
})
export class UserModule { }
