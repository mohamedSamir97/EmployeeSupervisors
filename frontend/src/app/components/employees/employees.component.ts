import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  employeeDialog: boolean = false;
  assignSupervisorDialog : boolean = false;

  employees: Employee[] = [];

  employee!: Employee;

  selectedEmployee!: Employee[] | null;

  submitted: boolean = false;

  statuses!: any[];

  nameExists: boolean = false;

  nameBoxMsg : string = '';

  supervisors: any[]  = [];

  selectedSupervisor: any = {} ;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getEmployees();

  }

  getEmployees(){
    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.employees = response.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
            life: 3000,
          });
        }
      },
      error: (err): any => {
        console.log(err.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'An error occurred: ' + err.error.message == undefined
              ? 'Unknown'
              : err.error.message,
          life: 3000,
        });
      },
    });
  }

  openNew() {
    this.employee = {} as Employee;
    this.submitted = false;
    this.employeeDialog = true;
  }



  deleteEmployee(employee: Employee) {
    this.employee = employee;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + employee.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employeeService
          .deleteEmployee(this.employee as Employee)
          .subscribe({
            next: (response: any) => {
              if (response.success) {
                this.employees = this.employees.filter(
                  (val) => val.id !== employee.id
                );
                this.employee = {} as Employee;
                this.getEmployees();

                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Employee Deleted Successfully',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: response.message,
                  life: 3000,
                });
              }
            },
            error: (err: any) => {
              console.log(JSON.stringify(err));
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred: ' + err.error.message,
                life: 3000,
              });
            },
          });
      },
    });
  }

  hideDialog() {
    this.employeeDialog = false;
    this.assignSupervisorDialog = false;
    this.submitted = false;
    this.nameBoxMsg = '';
  }

  showAssignDialog(employee: Employee){
    this.employee = employee;
    this.supervisors = [];
    if(this.employee.supervisor_id == '0'){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Can not sign supervisor for Senior supervisor',
        life: 3000,
      });
      return;
    }

    this.employeeService.getPotentialSupervisors(this.employee.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.supervisors = this.findPotentialSupervisors(res.data,this.employee.id ) ;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
            life: 3000,
          });
          this.selectedSupervisor.id = res.data[0].id;
        }
      },
      error: (err: any) => {
        console.log(JSON.stringify(err));
        this.nameBoxMsg= '';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred',
          life: 3000,
        });
        this.selectedSupervisor.id = '-1';
      },
    });

    this.assignSupervisorDialog = true;
  }

  saveEmployee() {
    this.submitted = true;

    if (this.employee?.name != undefined && this.employee.name?.trim().length > 0) {
      this.employee.supervisor_id = 'NULL';
      this.employee.name = this.employee.name.trim();
      if(this.employee.isSeniorSupervisor){

        this.employees = this.employees.map(employee => ({
          ...employee,
          supervisor_id: employee.supervisor_id == '0' ? '' : employee.supervisor_id,
        }));
      }

      this.employeeService.createEmployee(this.employee as Employee).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.employees.push(response.data);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Employee Created',
              life: 3000,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
              life: 3000,
            });
          }
        },
        error: (err: any) => {
          console.log(JSON.stringify(err));
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred',
            life: 3000,
          });
        },
      });
    }
    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Name is required',
        life: 3000,
      });
      return;
    }

    this.employeeDialog = false;
    this.nameBoxMsg = "";
    this.employee = {} as Employee;
  }

  assignSupervisor(emp_id : string, supervisor_id :string){
    if(supervisor_id == undefined ){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No supervisor selected!',
        life: 3000,
      });
      return;
    }
    else if(supervisor_id == '-1'){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No supervisor available!',
        life: 3000,
      });
      return;
    }
    this.employeeService.assignSupervisorToEmp(emp_id,supervisor_id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: response.message,
            life: 3000,
          });
          this.getEmployees();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
            life: 3000,
          });
        }
      },
      error: (err: any) => {
        console.log(JSON.stringify(err));
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred',
          life: 3000,
        });
      },
    });
    this.assignSupervisorDialog = false;
  }

  onNameBlur() {
    if (
      this.employee.name != undefined &&
      this.employee.name?.trim().length > 0
    ) {
      this.employeeService.checkEmployeeName(this.employee.name).subscribe({
        next: (res: any) => {
          //res.success =1 mean name is available
          if (res.success) {
            this.nameExists = false;
            this.nameBoxMsg = res.message;
          } else {
            this.nameExists = true;
            this.nameBoxMsg = res.message;
          }
        },
        error: (err: any) => {
          console.log(JSON.stringify(err));
          this.nameBoxMsg= '';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred',
            life: 3000,
          });
        },
      });
    }
    else{
      this.nameBoxMsg= '';
    }
  }

  //helpers
  isNameEmpty(): boolean {
    return this.employee.name?.trim() === '' || this.employee.name === undefined || this.employee.name === null || this.nameExists;
  }

  findPotentialSupervisors(employees: Employee[], empId: string) {
    let notAllowedSupervisors : Employee[] = [];
    //get all emp and subordinates where emp.supervisor_id  = empId
    for(let i = 0 ; i < employees.length ;i++ ){
      let emp = employees[i];

      if(emp.supervisor_id == empId){
        notAllowedSupervisors.push(emp);
        getSubordinates([...employees],emp.id);
      }
    }
    function getSubordinates(employees: Employee[], EmployeeId :string){
      employees.forEach((element,index ) => {
        if(element.supervisor_id == EmployeeId){
          notAllowedSupervisors.push(element);
          getSubordinates(employees.splice(index,1), element.id);
        }
      });
    }

    const employeesNotInNotAllowedSupervisors = employees.filter((employee) => {
      return !notAllowedSupervisors.includes(employee);
    });


    return employeesNotInNotAllowedSupervisors;
  }
}
