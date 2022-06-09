import { Component, OnInit } from '@angular/core';
import { Technology } from 'src/app/models/technology.model';
import { DataService } from 'src/app/services/data-services/data.service';
import { HostListener } from "@angular/core";
import { MyProject } from 'src/app/models/my-project.model';
import { ModeBindingService } from 'src/app/services/binding-services/mode-binding.service';
import { TechBindingService } from 'src/app/services/binding-services/tech-binding.service';
import { ProjBindingService } from 'src/app/services/binding-services/proj-binding.service';
import { TechListBindingService } from 'src/app/services/binding-services/tech-list-binding.service';

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
  private projList: Array<MyProject> = [];
  private projGetAllEndPoint: string = "my-project/list";
  private projUpdateEndPoint: string = "my-project/update";
  private endPoint: string = "technology/list";
  private delEndPoint: string = "technology/delete";

  scrWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: any) {
    this.scrWidth = window.innerWidth;
    console.log(this.scrWidth);
  }

  public editMode: boolean = false;

  constructor(
    private dataService: DataService<T>,
    private modeBindingService: ModeBindingService<T>,
    private techBindingService: TechBindingService<T>,
    private projBindingService: ProjBindingService<T>,
    private techListBindingService: TechListBindingService<T>
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
    /* this.techBindingService.dataEmitter.subscribe((data: Array<Technology>) => {
      this.techListShown = data;
      this.ngOnInit();
    }) */
  }

  ngOnInit(): void {
    this.dataService.getAll<Array<Technology>>(this.endPoint).subscribe(response => {
      console.log("tech -> ", response);
      response.sort((a, b) => a.techIndex - b.techIndex);
      console.log("width  ", window.innerWidth)
      this.techList = response;
      this.techListShown = this.techList.filter(elem => elem.techShow);
      this.techListBinding(this.techListShown);
      this.getScreenSize();
    })
  };

  deleteTech(id: number) {
    this.dataService.delete(`${this.delEndPoint}/${id}`).subscribe(resp => {
      console.log("tec respones delete ", resp)
      this.projBinding<MyProject>(resp);
    });

  }


  openTechSet() {
    //$("#newTech").modal("show");
    $("#editTechSet").modal("show");
  }

  openEdit(i: number) {
    this.techBinding<Technology>(this.techList[i]);
    $("#editTech").modal("show");
  }

  modeBinding<T>(data: T) {
    this.modeBindingService.setData<T>(data);
  }

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
