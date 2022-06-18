import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MyProject } from 'src/app/models/my-project.model';
import { ProjListBindingService } from 'src/app/services/binding-services/proj-list-binding-service';
import { DataService } from 'src/app/services/data-services/data.service';

declare var $ : any;

@Component({
  selector: 'app-proj-set-edit',
  templateUrl: './proj-set-edit.component.html',
  styleUrls: ['./proj-set-edit.component.css']
})
export class ProjSetEditComponent<T> implements OnInit {

  private projListEndPoint: string="my-project/list";
  private projUpdateEndPoint: string="my-project/update/list";

  private list: Array<MyProject>=[];
  public projListAll: Array<MyProject>=[];
  public projListTrue: Array<MyProject>=[];
  public projListFalse: Array<MyProject>=[];
  private projListToSend: Array<MyProject>=[];
  private projSetChanged: Set<number>=new Set();
  private proj: MyProject={
    projId:0,
    projName:"",
    projDescription:"",
    projUrl:"",
    projIndex:0,
    projShow:false,
    techList:[]
  }

  setForm: FormGroup;
  setFormArray: FormArray;

  onCheckboxChange(e: any) {
    this.projSetChanged.add(e.target.value)
    this.proj = this.projListAll.find(elem => elem.projId == e.target.value)|| this.proj;
    if(this.proj.projShow){
      this.proj.projShow= false;
      this.projListTrue= this.projListTrue.filter(elem => elem.projId != this.proj.projId);
      this.projListFalse.push(this.proj); 
    }else{
      this.proj.projShow= true;
      this.projListFalse= this.projListFalse.filter(elem => elem.projId != this.proj.projId);
      this.projListTrue.push(this.proj); 
    }
    console.log("projSetChanged ", this.projSetChanged);
  }

  onIndexChange(e:any){
    this.projSetChanged.add(e.target.id);
    this.projListTrue.forEach(elem=>{
      if(elem.projId==e.target.id){
        elem.projIndex=e.target.value;
      }
    })
    console.log("set proj event value", e.target.value);
    console.log("set proj event id", e.target.id);
  }


  constructor(
    private fb: FormBuilder,
    private service: DataService<T>,
    private projListBindingService: ProjListBindingService<Array<MyProject>>
  ) {
    this.setForm=this.fb.group({setFormArray: this.fb.array([])});
    this.setFormArray= this.setForm.get('setFormArray') as FormArray;

    this.setForm= this.fb.group({
      setList: this.fb.array([])
    })

    this.service.getAll<any>(this.projListEndPoint).subscribe(response =>{
      if(response.statusCode== "OK"){
        this.projListAll= Object.values(response.body);
        this.projListAll.sort((a: MyProject, b: MyProject): number => a.projIndex - b.projIndex);
        this.projListTrue= this.projListAll.filter((elm: MyProject) => elm.projShow) || [];
        this.projListFalse= this.projListAll.filter((elm: MyProject) => !elm.projShow) || [];
      }else{
        window.alert(`Error: ${response.statusCode}`);
      }
    })

  } // End Constructor

  ngOnInit(): void {
  }

  setSubmit(){
    // Enviar la lista al backend y que él se encargue de actualizar cada uno
      for(let item of this.projSetChanged){
        console.log("item set", item);
        this.projListAll.forEach(sendProj =>{
          if(sendProj.projId==item){
            this.projListToSend.push(sendProj);
          }
          this.service.update(this.projUpdateEndPoint, this.projListToSend).subscribe(resp=>{
            if(resp.statusCode== "OK"){
              this.projListAll= Object.values(resp.body);
              this.projListAll.sort((a: MyProject, b: MyProject): number => a.projIndex - b.projIndex);
              this.projListTrue= this.projListAll.filter((elm: MyProject) => elm.projShow) || [];
              this.projListFalse= this.projListAll.filter((elm: MyProject) => !elm.projShow) || [];
              this.projListBinding<Array<MyProject>>(this.projListAll);
              this.closePopup();
            }else{
              window.alert(`Error: ${resp.statusCode}`);
            }
          })
        })
      }
      //this.closePopup();
    }


  closePopup(){
    //this.projListBinding<Array<MyProject>>(this.projListAll);
    $("#editProjSet").modal("hide");
  }

  
  projListBinding<T>(data: T){
    this.projListBindingService.setData<T>(data);
  }

}
