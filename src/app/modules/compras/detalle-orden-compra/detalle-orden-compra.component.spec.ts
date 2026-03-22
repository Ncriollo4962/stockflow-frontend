import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleOrdenCompraComponent } from './detalle-orden-compra.component';

describe('DetalleOrdenCompraComponent', () => {
  let component: DetalleOrdenCompraComponent;
  let fixture: ComponentFixture<DetalleOrdenCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleOrdenCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
