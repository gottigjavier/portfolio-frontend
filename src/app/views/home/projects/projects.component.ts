import { Component, OnInit } from '@angular/core';
import { MyProject } from 'src/app/models/my-project.model';
import { Technology } from 'src/app/models/technology.model';
import { ModeBindingService } from 'src/app/services/binding-services/mode-binding.service';
import { PopupBindingService } from 'src/app/services/binding-services/popup-binding.service';
import { ProjBindingService } from 'src/app/services/binding-services/proj-binding.service';
import { TechBindingService } from 'src/app/services/binding-services/tech-binding.service';
import { TechListBindingService } from 'src/app/services/binding-services/tech-list-binding.service';
import { DataService } from 'src/app/services/data-services/data.service';

declare var $: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent<T> implements OnInit {

  public projList: Array<MyProject> = [];
  public projListTechShown: Array<MyProject> = [];
  private endPoint: string = "my-project/list";
  public techListShown: Array<Technology> = [];
  private proj: MyProject={
    projId:0,
    projName:"",
    projDescription:"",
    projUrl:"",
    projShow: true,
    projIndex:0,
    techList:[]
  }


  public editMode: boolean = false;

  constructor(
    private dataService: DataService<T>,
    private modeBindingService: ModeBindingService<T>,
    private techBindingService: TechBindingService<T>,
    private projBindingService: ProjBindingService<T>,
    private popupBindingService: PopupBindingService<T>,
    private techListBindingService: TechListBindingService<T>
  ) {
    this.modeBindingService.dataEmitter.subscribe((data: boolean) => {
      this.editMode = data;
    })
    
    /* this.projBindingService.dataEmitter.subscribe((data: MyProject) => {
      if(data){
          this.projList.forEach(proj => {
            if (data.projId==proj.projId) {
              proj = data;
            }
          })
          this.ngOnInit();
        }
    }) */

    this.techListBindingService.dataEmitter.subscribe((data: Array<Technology>) =>{
      data.sort((a, b) => a.techIndex - b.techIndex);
      this.techListShown= data.filter(elem => elem.techShow==true);
      this.ngOnInit();
    })
  }

  ngOnInit(): void {
    this.dataService.getAll<Array<MyProject>>(this.endPoint).subscribe(response => {
      response.sort((a, b) => a.projIndex - b.projIndex);
      this.projList = response;
      this.projList.forEach(elem=>{
        elem.techList.sort((a, b) => a.techIndex - b.techIndex);
      })
    })
    this.projBindingService.dataEmitter.subscribe((data: MyProject) => {
      //if(data){
          this.projList.forEach(proj => {
            if (data.projId==proj.projId) {
              proj = data;
            }
            this.dataService.getAll<Array<MyProject>>(this.endPoint).subscribe(response => {
              response.sort((a, b) => a.projIndex - b.projIndex);
              this.projList = response;
            })
            return this.projList;
          })
        //}
    })
  };

  
  openEditOneProj(i: number) {
    this.proj= this.projList.find(elem=> elem.projId== i) || this.proj;
    this.popupBinding<MyProject>(this.proj);
    this.techListBinding<Array<Technology>>(this.techListShown);
    $("#editProj").modal("show");
  }
  
  openNewProj(){
    this.techListBinding<Array<Technology>>(this.techListShown);
    $("#newProj").modal("show");
  }
  
  openEditProjSet(){

  }

  openDeleteProj(){

  }

  popupBinding<T>(data: T) {
    this.popupBindingService.setData<T>(data);
  }

  techListBinding<T>(data: T) {
    this.techListBindingService.setData<T>(data);
  }

}