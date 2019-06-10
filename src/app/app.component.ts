
import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import {MatSnackBar} from '@angular/material/snack-bar'
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CamundaPOC';
  view = "grid";
  allTasks = [];
  roleTasks = [];
  menuArray;
  selectedrole = 'Provider';
  qSet = "";
  age =0;
  skill ="";
  hasHistory = "false";
  hasReports = "false";
  displayedColumns: string[] = ['name', 'created', 'due', 'id', 'action'];
  links = ['Windstorm - jhgh', 'Bombasto', 'Magneta', 'Tornado'];
  roles: string[] = ['Provider', 'Indexer', 'Data Support', 'Pharmacy Tech', 'Clinical', 'MD'];
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  ];
  constructor(private apiService: ApiService, private snack: MatSnackBar) { }
  ngOnInit() {
    this.reloadTasks();
  }

  FilterByQueue(name: string) {
    this.view = 'grid';
    this.roleTasks = this.allTasks.filter(item => (item.name == name) && (item.assignee == this.selectedrole));
  }


  changeRole(event: any) {
    this.view = 'grid';
    this.roleTasks = this.allTasks.filter(item => item.assignee == event.value);
    this.menuArray = this.allTasks.filter(item => item.assignee == event.value).reduce((total, value) => {
        total[value.name] = (total[value.name] || 0) + 1;
        return total;
    }, {});
  }

  initiateWF() {
    this.view = 'entry';
  }

  createTask() {

    this.apiService.createTaskData.variables.age.value = this.age;
    this.apiService.createTaskData.variables.history.value = (this.hasHistory == "true");
    this.apiService.createTaskData.variables.reports.value = (this.hasReports == "true");
    this.apiService.createTaskData.variables.qset_status.value = this.qSet;
    this.apiService.createTaskData.variables.skill.value = this.skill;
    this.apiService.createTaskData.variables.status.value = "inprogress"
    console.log(this.apiService.createTaskData);
    this.apiService.initiateWF(this.apiService.createTaskData).subscribe((res: any) => {
      this.reloadTasks();
      this.view = 'grid';
    }, (error:any) => {this.showMessage(true)},() => {this.showMessage(false)});
   
  }
  completeTask(taskID: string, action: string) {
    console.log(taskID);
    this.apiService.completeTaskData.variables.usertaskResult.value.action =  action;
    this.apiService.completeTaskData.variables.usertaskResult.value.user =  this.selectedrole;
    if (this.selectedrole == 'Data Support') {
    this.apiService.completeTaskData.variables.data_verified.value = true;
    }
    this.apiService.completeTask(taskID, this.apiService.completeTaskData).subscribe((res: any) => {
      this.reloadTasks();
    }, (error:any) => {this.showMessage(true)},() => {this.showMessage(false)});
  }

  showMessage(isError: boolean){
    if (isError) {
      this.snack.open("Error while processsing", "close", {duration: 2000})
    } else {
      this.snack.open("Processed successfully", "close", {duration: 2000})
    }
  }
  reloadTasks() {
  ///  this.apiService.getaTasks().subscribe((res: any) => { });
    this.apiService.getTasks().subscribe((res: any) => {
      this.allTasks = res;
      this.roleTasks = this.allTasks.filter(item => item.assignee == this.selectedrole);
      this.menuArray = this.allTasks.filter(item => item.assignee == this.selectedrole).reduce((total, value) => {
        total[value.name] = (total[value.name] || 0) + 1;
        return total;
    }, {});
      console.log(this.menuArray);
    }, (error:any) => {this.showMessage(true)});
  }
}
