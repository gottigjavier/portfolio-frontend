import { Component, OnInit } from '@angular/core';
import { Technology } from 'src/app/models/technology.model';
import { DataService } from 'src/app/services/data-services/data.service';
import { HostListener } from "@angular/core";
import { MyProject } from 'src/app/models/my-project.model';
import { ModeBindingService } from 'src/app/services/binding-services/mode-binding.service';
import { TechBindingService } from 'src/app/services/binding-services/tech-binding.service';
import { ProjBindingService } from 'src/app/services/binding-services/proj-binding.service';
import { TechListBindingService } from 'src/app/services/binding-services/tech-list-binding.service';
import { PopupBindingService } from 'src/app/services/binding-services/popup-binding.service';

declare var $: any;

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.css']
})
export class TechnologiesComponent<T> implements OnInit {


  public techList: Array<Technology> = [];
  public techListShown: Array<Technology> = [];
  private tech: Technology;
  private techListToSend: Array<Technology> = [];
  
  private techListEndPoint: string = "technology/list";
  
  scrWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: any) {
    this.scrWidth = window.innerWidth;
    console.log(this.scrWidth);
  }

  public editMode: boolean = false;

  private list: Array<Technology>=[];

  constructor(
    private dataService: DataService<T>,
    private modeBindingService: ModeBindingService<boolean>,
    private techBindingService: TechBindingService<Technology>,
    private projBindingService: ProjBindingService<MyProject>,
    private techListBindingService: TechListBindingService<Array<Technology>>,
    private popupBindingService: PopupBindingService<T>
  ) {

    this.tech = {
      techId: 0,
      techName: "",
      techType: "",
      techDescription: "",
      techIconUrl: "",
      techLevel: 0,
      techIndex: 0,
      techShow: false
    }


    this.modeBindingService.dataEmitter.subscribe((data: boolean) => {
      this.editMode = data;
    })

  }

  ngOnInit(): void {
    this.dataService.getAll<any>(this.techListEndPoint).subscribe(response => {
      console.log("tech -> ", response);
      if(response.statusCode == "OK"){
        this.techList = Object.values(response.body);
        this.techList.sort((a: Technology, b: Technology): number => a.techIndex - b.techIndex);
        console.log("width  ", window.innerWidth)
        if(Array.isArray(this.techList)){
          this.techListShown = this.techList.filter((elem: Technology) => elem.techShow==true) || [];
        }
        this.getScreenSize();
      }else{
        window.alert(`Error: ${response.statusCode}`);
      }
    })

    this.techBindingService.dataEmitter.subscribe((data: Technology) => {
      this.techList.forEach(elem => {
        if(elem.techId==data.techId){
          elem= data;
          return
          }
        })
      })

    this.techListBindingService.dataEmitter.subscribe((data: Array<Technology>) => {
      this.techList= data;
      this.techList.sort((a: Technology, b: Technology): number => a.techIndex - b.techIndex);
        this.techListShown = this.techList.filter((elem: Technology) => elem.techShow==true) || [];
    })
  };


  openTechSet() {
    this.techListBinding<Array<Technology>>(this.techList);
    $("#editTechSet").modal("show");
  }

  openNewTech() {
    $("#newTech").modal("show");
  }

  openEdit(tech: Technology) {
    console.log("edint one techhhh ", tech)
    this.techListBinding<Array<Technology>>(this.techList);
    this.techBinding<Technology>(tech);
    $("#editTech").modal("show");
  }

  openDeleteTech(){
    this.techListBinding<Array<Technology>>(this.techList);
    $("#deleteTech").modal("show");
  }

  modeBinding<T>(data: T) {
    this.modeBindingService.setData<T>(data);
  }

  /* popupBinding<T>(data: T) {
    this.popupBindingService.setData<T>(data);
  }
 */
  techBinding<T>(data: T) {
    this.techBindingService.setData<T>(data);
  }

  projBinding<T>(data: T) {
    this.projBindingService.setData<T>(data);
  }

  techListBinding<T>(data: T) {
    this.techListBindingService.setData<T>(data);
  }

}
