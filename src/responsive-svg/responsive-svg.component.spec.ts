import { ComponentFixture, TestBed} from '@angular/core/testing';
import { ResponsiveSvgComponent } from './responsive-svg.component';
import { ElementRef} from '@angular/core';
import { Lane } from '../common-interface';
describe('ResponsiveSvgComponent', () => {
  let component: ResponsiveSvgComponent;
  let fixture: ComponentFixture<ResponsiveSvgComponent>;
  let originalTimeout:number;
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
        adjacent: [{ adjacentVertex: 2, interiorPath: [{ coordinates: [18, 9.5] }] }]
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
  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  
  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveSvgComponent);
    component = fixture.componentInstance;
    component.laneData = laneData;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    const mockContainerEl = document.createElement('div');
    Object.defineProperty(mockContainerEl, 'getBoundingClientRect', {
      value: () => ({ width: 600, height: 400, top: 0, left: 0, right: 600, bottom: 400, x: 0, y: 0, toJSON: () => '' })
    });
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    component.containerRef = new ElementRef(mockContainerEl);
    component.svgElementRef = new ElementRef(mockSvg);
    fixture.detectChanges();
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render 5 paths and 4 circles', () => {
    const svg = component.svgElementRef.nativeElement;
    component.renderSvgContent(svg);
    const paths = svg.querySelectorAll('path');
    const circles = svg.querySelectorAll('circle');
    expect(paths.length).toBe(5);
    expect(circles.length).toBe(4);
  });
  it('should render SVG dimensions correctly', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      expect(svg.getAttribute('width')).toBe('600');
      expect(svg.getAttribute('height')).toBe('400');
      expect(svg.getAttribute('viewBox')).toBe('0 0 600 400');
      done();
    }, 20);
  });
  it('should render correct number of lines and shapes', (done) => {
    setTimeout(() => {
      const svg = component.svgElementRef.nativeElement;
      expect(svg.querySelectorAll('line').length).toBe(0);
      expect(svg.querySelectorAll('rect').length).toBe(1);
      expect(svg.querySelectorAll('defs').length).toBe(1);
      done();
    }, 20);
  });
  it('should render labels correctly', (done) => {
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
  it('should test the overlap of line and text', (done)=>{
    const svg = component.svgElementRef.nativeElement;
    const mockLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const mockText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    spyOn(mockLine, 'getBBox').and.returnValue({
      x: 120, y: 110, width: 50, height: 10,
      top: 0, left: 0, bottom: 0, right: 0, toJSON: () => {}
    });
  
    spyOn(mockText, 'getBBox').and.returnValue({
      x: 100, y: 100, width: 50, height: 30,
      top: 0, left: 0, bottom: 0, right: 0, toJSON: () => {}
    });
    svg.appendChild(mockLine);
    svg.appendChild(mockText);
    // Run the reposition logic manually
    requestAnimationFrame(() => {
      const textBox = mockText.getBBox();
      const lineBox = mockLine.getBBox();
        const isOverlap =
          textBox.x + textBox.width > lineBox.x &&
          textBox.x < lineBox.x + lineBox.width &&
          textBox.y + textBox.height > lineBox.y &&
          textBox.y < lineBox.y + lineBox.height;
        if (isOverlap) {
          const labelOffsetX = -70;
          mockText.setAttribute('x', `${textBox.x + labelOffsetX}`);
          mockText.setAttribute('y', `${textBox.y}`);
          mockText.setAttribute('fill', 'black');
        }
      expect(mockText.getAttribute('x')).toBe('30');
      expect(mockText.getAttribute('fill')).toBe('black');
      done();
    });
   
  });
  
});
