import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getEmployees() {
    return this.http.get(this.baseUrl + 'employees/').pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  checkEmployeeName(name: string){
    return this.http.post(this.baseUrl + 'employees/checkname',{name}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createEmployee(emp : Employee) {
    return this.http.post(this.baseUrl + 'employees/', emp).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getEmployeesHierarchy(){
    return this.http.get(this.baseUrl + 'employees/gethierarchy').pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  deleteEmployee(emp: Employee){
    return this.http.post(this.baseUrl + 'employees/delete',{id: emp.id}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getPotentialSupervisors(id: string){
    return this.http.post(this.baseUrl + 'employees/getPotentialSupervisors',{id}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  assignSupervisorToEmp(id: string, supervisor_id: string){
    return this.http.post(this.baseUrl + 'employees/assignSupervisorToEmp',{id, supervisor_id}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }



}
