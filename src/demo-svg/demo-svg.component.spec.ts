import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Lane } from '../common-interface';
import { ResponsiveSvgComponent } from './demo-svg.component';
import { ElementRef } from '@angular/core';

describe('ResponsiveSvgComponent', () => {
  let component: ResponsiveSvgComponent;
  let fixture: ComponentFixture<ResponsiveSvgComponent>;

  const laneData: Lane = {
    id: "680bc0",
    name: "Lane 1",
    vertices: [
      {
        id: 0,
        name: "Pre-Warn",
        vertexType: "SERVICE_POINT",
        isEntry: true,
        location: { coordinates: [18.0, 2.0] },
        adjacent: [{ adjacentVertex: 1, interiorPath: [] }]
      },
      {
        id: 1,
        name: "Order",
        vertexType: "SERVICE_POINT",
        isEntry: false,
        location: { coordinates: [18.0, 7.0] },
        adjacent: [{
          adjacentVertex: 2,
          interiorPath: [{ coordinates: [18, 9.5] }]
        }]
      },
      {
        id: 2,
        name: "Cash",
        vertexType: "SERVICE_POINT",
        isEntry: false,
        location: { coordinates: [8.0, 9.5] },
        adjacent: [{ adjacentVertex: 3, interiorPath: [] }]
      },
      {
        id: 3,
        name: "Present",
        isEntry: false,
        location: { coordinates: [0.5, 9.5] },
        adjacent: []
      },
      {
        id: 4,
        name: "Cash",
        vertexType: "PRE_MERGE_POINT",
        isEntry: false,
        location: { coordinates: [8.0, 9.5] },
        adjacent: [{ adjacentVertex: 3, interiorPath: [] }]
      },
      {
        id: 5,
        name: "merge",
        vertexType: "LANE_MERGE",
        isEntry: false,
        location: { coordinates: [8.0, 9.5] },
        adjacent: [{ adjacentVertex: 3, interiorPath: [] }]
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveSvgComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveSvgComponent);
    component = fixture.componentInstance;
    component.laneData =  laneData;
  
    const mockContainerEl = document.createElement('div');
    Object.defineProperty(mockContainerEl, 'getBoundingClientRect', {
      value: () => ({
        width: 600,
        height: 400,
        top: 0,
        left: 0,
        right: 600,
        bottom: 400,
        x: 0,
        y: 0,
        toJSON: () => ''
      })
    });
  
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
    component.containerRef = new ElementRef(mockContainerEl);
    component.svgElementRef = new ElementRef(mockSvg);
  
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set svg dimensions after init', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      expect(svg.getAttribute('width')).toBe('600');
      expect(svg.getAttribute('height')).toBe('400');
      expect(svg.getAttribute('viewBox')).toBe('0 0 600 400');
      done();
    }, 20);
  });

  it('should render 4 vertices as circles', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).toBe(4);
      done();
    }, 20);
  });

  it('should render 3 lines between vertices', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      const lines = svg.querySelectorAll('line');
      expect(lines.length).toBe(5); // 0→1, 1→2, 2→3
      done();
    }, 20);
  });

  it('should render square boxes', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      const rects = svg.querySelectorAll('rect');
      expect(rects.length).toBe(1);
      done();
    }, 20);
  });

  it('should render eclipse', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      const rects = svg.querySelectorAll('defs');
      expect(rects.length).toBe(1);
      done();
    }, 20);
  });

  it('should render 4 text labels', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      const texts = svg.querySelectorAll('text');
      expect(texts.length).toBe(6);
      expect(texts[0].textContent).toBe('Pre-Warn');
      expect(texts[1].textContent).toBe('Order');
      expect(texts[2].textContent).toBe('Cash');
      expect(texts[3].textContent).toBe('Present');
      done();
    }, 20);
  });
});
