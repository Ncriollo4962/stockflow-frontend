import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegeditUsuarioComponent } from './regedit-usuario.component';

describe('RegeditUsuarioComponent', () => {
  let component: RegeditUsuarioComponent;
  let fixture: ComponentFixture<RegeditUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegeditUsuarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegeditUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
