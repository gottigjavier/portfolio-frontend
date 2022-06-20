import { Component, OnInit } from '@angular/core';
import { MyProject } from 'src/app/models/my-project.model';
import { Technology } from 'src/app/models/technology.model';
import { ModeBindingService } from 'src/app/services/binding-services/mode-binding.service';
import { ProjBindingService } from 'src/app/services/binding-services/proj-binding.service';
import { ProjListBindingService } from 'src/app/services/binding-services/proj-list-binding-service';
import { ProjTechListBindingService } from 'src/app/services/binding-services/proj-tech-list-binding.service';
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
  public projListShown: Array<MyProject> = [];
  public projListTechShown: Array<MyProject> = [];
  private projEndPoint: string = "my-project/list";
  private techEndPoint: string = "technology/list";
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
  list: any;

  constructor(
    private dataService: DataService<T>,
    private modeBindingService: ModeBindingService<boolean>,
    private projBindingService: ProjBindingService<MyProject>,
    private techListBindingService: TechListBindingService<Array<Technology>>,
    private projTechListBindingService: ProjTechListBindingService<Array<Technology>>,
    private projListBindingService: ProjListBindingService<Array<MyProject>>
  ) {

    this.modeBindingService.dataEmitter.subscribe((data: boolean) => {
      this.editMode = data;
    })
    
  }

  ngOnInit(): void {
    this.dataService.getAll<any>(this.projEndPoint).subscribe(response => {
      if(response.statusCode == "OK"){
        this.projList= Object.values(response.body);
        this.projList.sort((a: MyProject, b: MyProject): number => a.projIndex - b.projIndex);
        this.projListShown= this.projList.filter((elem: MyProject) => elem.projShow==true) || [];
        this.projList.forEach(elem=>{
          elem.techList.sort((a: Technology, b: Technology): number => a.techIndex - b.techIndex);
        })
      }else{
        window.alert(`Error: ${response.statusCode}`);
      }
    })

    this.projBindingService.dataEmitter.subscribe((data: MyProject) => {
      this.projList.forEach(proj => {
        if (data.projId==proj.projId) {
          proj = data;
        }
        this.projListShown= this.projList.filter((elem: MyProject) => elem.projShow==true) || [];
        this.projList.forEach(elem=>{
          elem.techList.sort((a: Technology, b: Technology): number => a.techIndex - b.techIndex);
        })
      })
    })

    this.projListBindingService.dataEmitter.subscribe((data: Array<MyProject>)=>{
      this.projList= data;
      this.projList.sort((a: MyProject, b: MyProject): number => a.projIndex - b.projIndex);
        this.projListShown= this.projList.filter((elem: MyProject) => elem.projShow==true) || [];
    })

    // Si cambia una tech o la lista de tech visibles se reflejará en la lista de techs de cada proj
    // No es una solución elegante pero por ahora funciona.
    this.techListBindingService.dataEmitter.subscribe((data: Array<Technology>)=>{
      if(data){
        this.techListShown= data.filter(elem => elem.techShow==true) || [];
        this.techListShown.forEach(techShown=>{
          this.projListShown.forEach(proj => {
            proj.techList.filter(elem=> elem.techShow==true) || []; //Si saco una tech con set list
            let tl: Array<Technology>=[]
            proj.techList.forEach(tech => {
              if (tech.techId == techShown.techId) {
                tech = techShown;
              }
              tl.push(tech)
              proj.techList= tl;
            });
          })
      })
    }
    })
  };

  
  openEditOneProj(i: number) {
    this.proj= this.projList.find(elem=> elem.projId== i) || this.proj;
    this.projBinding<MyProject>(this.proj);
    this.projTechListBinding<Array<Technology>>(this.techListShown);
    $("#editProj").modal("show");
  }
  
  openNewProj(){
    this.projTechListBinding<Array<Technology>>(this.techListShown);
    $("#newProj").modal("show");
  }
  
  openEditProjSet(){
    this.projListBinding<Array<MyProject>>(this.projList);
    $("#editProjSet").modal("show");
  }

  openDeleteProj(){
    this.projListBinding<Array<MyProject>>(this.projList);
    $("#deleteProj").modal("show");
  }

  projBinding<T>(data: T) {
    this.projBindingService.setData<T>(data);
  }

  projListBinding<T>(data: T) {
    this.projListBindingService.setData<T>(data);
  }

  projTechListBinding<T>(data: T) {
    this.projTechListBindingService.setData<T>(data);
  }

}