import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { About } from 'src/app/models/about.model';
import { AboutListBindingService } from 'src/app/services/binding-services/about-list-binding.service';
import { DataService } from 'src/app/services/data-services/data.service';

declare var $ : any;

@Component({
  selector: 'app-about-create',
  templateUrl: './about-create.component.html',
  styleUrls: ['./about-create.component.css']
})
export class AboutCreateComponent<T> {

  public about: About;
  private list: Array<About>=[];

  private createAboutEndPoint: string="about/create";

  popupForm= this.fb.group({
    firstName: "",
    lastName: "",
    shortExplanation: "",
    photoUrl: "",
    aboutShown: false
  });
  
  constructor(
    private fb: FormBuilder,
    private dataService: DataService<T>,
    private aboutListBindingService: AboutListBindingService<About>
    ) {
    this.about={
      aboutId: 0,
      firstName: "",
      lastName: "",
      shortExplanation: "",
      photoUrl: "",
      aboutShown: false
    }

  }
  
  onSubmit(){
    this.about.firstName= this.popupForm.value.firstName || this.about.firstName;
    this.about.lastName= this.popupForm.value.lastName || this.about.lastName;
    this.about.shortExplanation= this.popupForm.value.shortExplanation || this.about.shortExplanation;
    this.about.photoUrl= this.popupForm.value.photoUrl || this.about.photoUrl;
    this.dataService.create(this.createAboutEndPoint, this.about).subscribe(resp =>{
      if(!resp){
        alert("Error: Not saved")
      }else{
        this.list= Object.values(resp.body);
        this.aboutListBinding<Array<About>>(this.list);
      }
    })
    this.closePopup();
    this.closePopup();
  }
  
  closePopup(){
    this.popupForm.reset();
    $("#newAbout").modal("hide");
  }

  aboutListBinding<T>(data: T){
    this.aboutListBindingService.setData<T>(data);
  }
}
