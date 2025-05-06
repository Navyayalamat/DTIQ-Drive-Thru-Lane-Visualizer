import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SvgImageComponent } from '../svg-image/svg-image.component';

describe('AppComponent', () => {
  let httpClient: HttpClient;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let httpMock: HttpTestingController;

  const mockLanes = [
    {
      id: 'lane-1',
      name: 'Lane 1',
      vertices: []
    },
    {
      id: 'lane-2',
      name: 'Lane 2',
      vertices: []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule, MatSelectModule, SvgImageComponent],
      providers: [
        provideHttpClient(),          
        provideHttpClientTesting(), 
      ]
    }).compileComponents();
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'summit' title`, () => {
    expect(component.title).toEqual('Drive-Thru Lane Visualizer');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Drive-Thru Lane Visualizer');
  });

  it('should fetch lanes on init', () => {
    const req = httpMock.expectOne('api/lanes');
    expect(req.request.method).toBe('GET');
    req.flush(mockLanes);
    expect(component.lanes.length).toBe(2);
    expect(component.selectedLaneId).toBe('lane-1');
    expect(component.selectedLane).toEqual(mockLanes[0]);
  });

  it('should call laneChanged is method', () => {
    component.lanes = mockLanes;
    component.laneChanged({ event: { value: 'lane-2' } });
    expect(component.selectedLaneId).toBe('lane-2');
    expect(component.selectedLane).toEqual(mockLanes[1]);
  });

});
