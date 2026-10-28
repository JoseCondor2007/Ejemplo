import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaListComponent } from './matricula-list.component';

describe('MatriculaListComponent', () => {
  let component: MatriculaListComponent;
  let fixture: ComponentFixture<MatriculaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatriculaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
