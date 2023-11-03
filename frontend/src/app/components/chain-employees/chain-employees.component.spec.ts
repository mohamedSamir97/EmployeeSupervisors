import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainEmployeesComponent } from './chain-employees.component';

describe('ChainEmployeesComponent', () => {
  let component: ChainEmployeesComponent;
  let fixture: ComponentFixture<ChainEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChainEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChainEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
