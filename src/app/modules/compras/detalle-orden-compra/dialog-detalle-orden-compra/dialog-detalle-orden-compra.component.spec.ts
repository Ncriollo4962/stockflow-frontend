import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleOrdenCompraComponent } from './dialog-detalle-orden-compra.component';

describe('DialogDetalleOrdenCompraComponent', () => {
  let component: DialogDetalleOrdenCompraComponent;
  let fixture: ComponentFixture<DialogDetalleOrdenCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetalleOrdenCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetalleOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
