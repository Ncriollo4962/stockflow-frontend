import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegeditOrdenCompraComponent } from './regedit-orden-compra.component';

describe('RegeditOrdenCompraComponent', () => {
  let component: RegeditOrdenCompraComponent;
  let fixture: ComponentFixture<RegeditOrdenCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegeditOrdenCompraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegeditOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
