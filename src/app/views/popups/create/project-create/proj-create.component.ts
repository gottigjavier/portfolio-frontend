import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MyProject } from 'src/app/models/my-project.model';
import { Technology } from 'src/app/models/technology.model';
import { PopupBindingService } from 'src/app/services/binding-services/popup-binding.service';
import { ProjBindingService } from 'src/app/services/binding-services/proj-binding.service';
import { TechListBindingService } from 'src/app/services/binding-services/tech-list-binding.service';
import { DataService } from 'src/app/services/data-services/data.service';

declare var $: any;

@Component({
  selector: 'app-proj-create',
  templateUrl: './proj-create.component.html',
  styleUrls: ['./proj-create.component.css']
})
export class ProjCreateComponent<T> {

  public proj: MyProject;

  private techSetChanged: Set<number> = new Set();
  public techListAll: Array<Technology> = [];
  public techListTrue: Array<Technology> = [];
  public techListShown: Array<Technology> = [];
  public techListFalse: Array<Technology> = [];
  private tech: Technology = {
    techId: 0,
    techName: '',
    techDescription: '',
    techType: '',
    techIconUrl: '',
    techIndex: 0,
    techLevel: 0,
    techShow: false,
  };

  private projCreateEndPoint: string = 'my-project/create';
  
  popupForm: FormGroup;
  techFormArray: FormArray;

  onCheckboxChange(e: any) {
    this.techSetChanged.add(e.target.value);
    console.log("event in projects edit ", e.target.checked);
    this.tech = this.techListShown.find((elem) => elem.techId == e.target.value) || this.tech;
    if (e.target.checked){
      this.techListFalse= this.techListFalse.filter(elem => elem.techId!=this.tech.techId);
      this.techListTrue.push(this.tech);
    }
    if (!e.target.checked) {
      this.techListTrue = this.techListTrue.filter(elem => elem.techId!=this.tech.techId);
      this.techListFalse.push(this.tech);
    } 
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataService<T>,
    private projBindingService: ProjBindingService<MyProject>,
    private popupBindingService: PopupBindingService<MyProject>,
    private techListBindingService: TechListBindingService<T>
  ) {
    this.proj = {
      projId: 0,
      projName: '',
      projDescription: '',
      projUrl: '',
      techList: [],
      projShow: true,
      projIndex: 99,
    };

    this.popupForm = this.fb.group({ techFormArray: this.fb.array([]) });
    this.techFormArray = this.popupForm.get('setFormArray') as FormArray;

    this.popupForm = this.fb.group({
      techList: this.fb.array([]),
    });

    this.popupForm = this.fb.group({
      projName: '',
      projDescription: '',
      projUrl: '',
      projIndex: 99,
      techList: this.fb.array([]),
    });

    /* this.popupBindingService.dataEmitter.subscribe((data: MyProject) => {
      this.proj = data;
    });
 */
    // to create the grid with used and unused techs for the project
    this.techListBindingService.dataEmitter.subscribe((data: Array<Technology>) => {
      this.techListShown = data;
      this.techListFalse= this.techListShown;
/*       this.techListTrue = this.proj.techList.filter(elem => elem.techShow==true);
      this.techListFalse= this.techListShown;
      for(let techFalse of this.techListFalse){
        for(let techTrue of this.techListTrue){
          if(techFalse.techId==techTrue.techId){
            this.techListFalse= this.techListFalse.filter(elem => elem.techId!= techTrue.techId);
            break;
          }
        }
      } */
    })
    
  } //end constructor

  
  onSubmit() {
    this.proj.projName= this.popupForm.value.projName || this.proj.projName;
    this.proj.projDescription= this.popupForm.value.projDescription || this.proj.projDescription;
    this.proj.projIndex= this.popupForm.value.projIndex || this.proj.projIndex;
    this.proj.projUrl= this.popupForm.value.projUrl || this.proj.projUrl;
    this.proj.techList = this.techListTrue;
    this.dataService.create<MyProject>(this.projCreateEndPoint, this.proj).subscribe((resp) => {
      if (!resp) {
        alert('Error: Not saved');
      }else{
        this.proj=resp;
      }
    });
    this.projBinding<MyProject>(this.proj);
    this.closePopup();
    this.closePopup();
  }
  
  closePopup() {
    this.projBinding<MyProject>(this.proj);
    this.techListTrue.length=0;
    this.popupForm.reset();
    $('#newProj').modal('hide');
  }

  projBinding<T>(data: T) {
    this.projBindingService.setData<T>(data);
  }
}