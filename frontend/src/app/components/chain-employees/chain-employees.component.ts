import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-chain-employees',
  templateUrl: './chain-employees.component.html',
  styleUrls: ['./chain-employees.component.css'],
})
export class ChainEmployeesComponent implements OnInit {
  employeesTree!: TreeNode[];

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) {}

  ngOnInit() {

    this.getEmployeesHierarchy();
  }

  getEmployeesHierarchy() {
    this.employeeService.getEmployeesHierarchy().subscribe({
      next: (response: any) => {
        if (response.success) {
          let employeesArr: any = [...response.data]; //to not change in the main employee list
          let firstSupervisor = this.getMinimumSupervisorId(employeesArr);
          const hasNoSupervisor = [...response.data]
            .filter((employee: any) => employee.supervisor_id === null)
            .map((emp: any) => ({
              key: `${emp.id}`,
              label: emp.name,
              icon: 'pi pi-user',
              children: this.buildHierarchy([...response.data], emp.id), // Get children of employees with no supervisor
            }))
            .sort((a: any, b: any) => a.key - b.key);

          let hierarchy = this.buildHierarchy(
            [...response.data],
            firstSupervisor
          );

          if (hasNoSupervisor.length > 0) {
            const noSupervisorNode = {
              key: 'no-supervisor',
              label: 'Employees with No Supervisor',
              icon: 'pi pi-user-minus',
              children: hasNoSupervisor,
            };
            hierarchy.push(noSupervisorNode);
          }

          this.employeesTree = hierarchy;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
            life: 3000,
          });
          this.employeesTree = [];
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
        this.employeesTree =[];
      },
    });
  }

  expandAll() {
    this.employeesTree.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.employeesTree.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  //helpers
  buildHierarchy(employees: Employee[], supervisorId: string) {
    const hierarchy: any = [];
    const hasSupervisorList = employees.filter(
      (emp) => emp.supervisor_id != null
    );
    hasSupervisorList.forEach((employee) => {
      if (employee.supervisor_id === supervisorId) {
        const children = this.buildHierarchy(hasSupervisorList, employee.id);
        const employeeNode: any = {
          key: `${supervisorId}-${employee.id}`,
          label: employee.name,
          icon: 'pi pi-user',
        };

        if (children.length > 0) {
          employeeNode.children = children;
        }

        hierarchy.push(employeeNode);
      }
    });

    return hierarchy;
  }

  getMinimumSupervisorId(employees: any) {
    const sortedEmployees = employees
      .filter((employee: any) => employee.supervisor_id !== null)
      .sort((a: any, b: any) => a.supervisor_id - b.supervisor_id);

    if (sortedEmployees.length > 0) {
      return sortedEmployees[0].supervisor_id;
    }

    return null; // Return null if no valid IDs are found
  }


}
