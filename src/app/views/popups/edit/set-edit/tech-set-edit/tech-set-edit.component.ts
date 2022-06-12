import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Technology } from 'src/app/models/technology.model';
import { TechBindingService } from 'src/app/services/binding-services/tech-binding.service';
import { TechListBindingService } from 'src/app/services/binding-services/tech-list-binding.service';
import { DataService } from 'src/app/services/data-services/data.service';

declare var $ : any;

@Component({
  selector: 'app-tech-set-edit',
  templateUrl: './tech-set-edit.component.html',
  styleUrls: ['./tech-set-edit.component.css']
})
export class TechSetEditComponent<T> implements OnInit {

  private techListEndPoint: string="technology/list";
  private techUpdateEndPoint: string="technology/update/list";

  public techListAll: Array<Technology>=[];
  public techListTrue: Array<Technology>=[];
  public techListFalse: Array<Technology>=[];
  private techListToSend: Array<Technology>=[];
  private techSetChanged: Set<number>=new Set();
  private tech: Technology={
    techId:0,
    techName:"",
    techDescription:"",
    techType:"",
    techIconUrl:"",
    techIndex:0,
    techLevel:0,
    techShow:false
  }

  setForm: FormGroup;
  setFormArray: FormArray;

  onCheckboxChange(e: any) {
    this.techSetChanged.add(e.target.value)
    this.tech = this.techListAll.find(elem => elem.techId == e.target.value)|| this.tech;
    if(this.tech.techShow){
      this.tech.techShow= false;
      this.techListTrue= this.techListTrue.filter(elem => elem.techId != this.tech.techId);
      this.techListFalse.push(this.tech); 
    }else{
      this.tech.techShow= true;
      this.techListFalse= this.techListFalse.filter(elem => elem.techId != this.tech.techId);
      this.techListTrue.push(this.tech); 
    }
    console.log("techSetChanged ", this.techSetChanged);
  }

  onIndexChange(e:any){
    this.techSetChanged.add(e.target.id);
    this.techListTrue.forEach(elem=>{
      if(elem.techId==e.target.id){
        elem.techIndex=e.target.value;
      }
    })
    console.log("set tech event value", e.target.value);
    console.log("set tech event id", e.target.id);
  }

  constructor(
    private fb: FormBuilder,
    private service: DataService<T>,
    private techListBindingService: TechListBindingService<T>
  ) {
    this.service.getAll<Array<Technology>>(this.techListEndPoint).subscribe(response =>{
      response.sort((a, b) => a.techIndex - b.techIndex);
      this.techListAll=response;
      this.techListTrue= this.techListAll.filter(elm => elm.techShow);
      this.techListFalse= this.techListAll.filter(elm => !elm.techShow);
    })

    this.setForm=this.fb.group({setFormArray: this.fb.array([])});
    this.setFormArray= this.setForm.get('setFormArray') as FormArray;

    this.setForm= this.fb.group({
      techList: this.fb.array([])
    })

  }

  ngOnInit(): void {
  }

  setSubmit(){
    // Enviar la lista al backend y que él se encargue de actualizar cada uno
      for(let item of this.techSetChanged){
        console.log("item set", item);
        this.techListAll.forEach(sendTech =>{
          if(sendTech.techId==item){
            this.techListToSend.push(sendTech);
          }
          this.service.update(this.techUpdateEndPoint, this.techListToSend).subscribe(resp=>{
            if(!resp){
              alert("Error: Not saved");
            }else{
              resp.sort((a:any, b:any) => a.techIndex - b.techIndex);
              this.techListAll= resp;
              this.techListTrue= this.techListAll.filter(elm => elm.techShow);
              this.techListFalse= this.techListAll.filter(elm => !elm.techShow);
            }
          })
        })
      }
      this.techListBinding<Array<Technology>>(this.techListAll);
      this.closePopup();
      this.closePopup();
    }
    
    
    closePopup(){
    this.techListBinding<Array<Technology>>(this.techListAll);
    $("#editTechSet").modal("hide");
  }

  
  techListBinding<T>(data: T){
    this.techListBindingService.setData<T>(data);
  }

}