import { Component,ElementRef,ViewChild,AfterViewInit,effect,runInInjectionContext,Signal,Input,Injector} from '@angular/core';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Lane, Rectangle } from '../common-interface';


@Component({
  selector: 'app-responsive-svg',
  template: `<div #container style="width: 100%; height: 100%;">
      <svg #svgEl preserveAspectRatio="none"></svg>
    </div>`,
  styles: [':host { display: block; width: 100%; height: 100%; }']
})
export class ResponsiveSvgComponent implements AfterViewInit {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild('svgEl', { static: true }) svgElementRef!: ElementRef<SVGSVGElement>;

  private scaleFactor = 30;

  @Input() laneData = {} as Lane;

  rect!: Signal<{ start: [number, number]; end: [number, number] }>;

  constructor(private injector: Injector) {}

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      const el = this.containerRef?.nativeElement;
  
      // DOM safety check
      if (!el || typeof el.getBoundingClientRect !== 'function') {
        console.warn('containerRef is not ready or does not support getBoundingClientRect');
        return;
      }
  
      const chartSize$ = new Observable<Rectangle>((subscriber) => {
        const emit = () => {
          const rect = el.getBoundingClientRect();
  
          subscriber.next({
            start: [0, 0],
            end: [rect.width, rect.height],
          });
        };
  
        emit(); // Emit initial size
  
        const resizeObserver = new ResizeObserver(() => emit());
        resizeObserver.observe(el);
  
        return () => resizeObserver.disconnect();
      });
  
      this.rect = toSignal(chartSize$, { requireSync: true });
  
      effect(() => {
        const svg = this.svgElementRef?.nativeElement;
        const rect = this.rect();
  
        if (!svg || !rect) return;
  
        const [w, h] = rect.end;
  
        svg.setAttribute('width', `${w}`);
        svg.setAttribute('height', `${h}`);
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  
        this.renderSvgContent(svg);
      });
    });
  }
  

  renderSvgContent(svg: SVGSVGElement): void {
    svg.innerHTML = ''; // to lane 1 data when lane 2 clicked
    const svgNS = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(svgNS, 'defs');
    svg.appendChild(defs);
  
    for (const vertex of this.laneData.vertices) {
      const [x, y] = vertex.location.coordinates.map((v) => v * this.scaleFactor);
  
      for (const adj of vertex.adjacent) {
        const target = this.laneData.vertices[adj.adjacentVertex];
        const [x2, y2] = target.location.coordinates.map((v) => v * this.scaleFactor);
  
        const pathPoints = [`M ${x} ${y}`];
  
        // If interiorPath exists, draw through those points
        if (adj.interiorPath && adj.interiorPath.length > 0) {
          for (const mid of adj.interiorPath) {
            const [mx, my] = mid.coordinates.map(v => v * this.scaleFactor);
            pathPoints.push(`L ${mx} ${my}`);
          }
        }
  
        pathPoints.push(`L ${x2} ${y2}`);
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', pathPoints.join(' '));
        path.setAttribute('stroke', '#b3b3ff');
        path.setAttribute('stroke-width', '30');
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
      }
  
      let shape: SVGElement | null = null;
  
      switch (vertex.vertexType) {
        case 'PRE_MERGE_POINT': {
          shape = document.createElementNS(svgNS, 'rect');
          shape.setAttribute('x', `${x - 15}`);
          shape.setAttribute('y', `${y - 15}`);
          shape.setAttribute('width', `30`);
          shape.setAttribute('height', `30`);
          shape.setAttribute('fill', 'green');
          break;
        }
  
        case 'LANE_MERGE': {
          const gradientId = `grad-${vertex.id}`;
          const linearGradient = document.createElementNS(svgNS, 'linearGradient');
          linearGradient.setAttribute('id', gradientId);
  
          const stop1 = document.createElementNS(svgNS, 'stop');
          stop1.setAttribute('offset', '0%');
          stop1.setAttribute('stop-color', 'yellow');
          linearGradient.appendChild(stop1);
  
          const stop2 = document.createElementNS(svgNS, 'stop');
          stop2.setAttribute('offset', '100%');
          stop2.setAttribute('stop-color', 'red');
          linearGradient.appendChild(stop2);
  
          defs.appendChild(linearGradient);
  
          shape = document.createElementNS(svgNS, 'ellipse');
          shape.setAttribute('cx', `${x}`);
          shape.setAttribute('cy', `${y}`);
          shape.setAttribute('rx', `25`);
          shape.setAttribute('ry', `15`);
          shape.setAttribute('fill', `url(#${gradientId})`);
          break;
        }
  
        case 'SERVICE_POINT':
        default: {
          shape = document.createElementNS(svgNS, 'circle');
          shape.setAttribute('cx', `${x}`);
          shape.setAttribute('cy', `${y}`);
          shape.setAttribute('r', `15`);
          shape.setAttribute('fill', '#0000cc');
          break;
        }
      }
  
      if (shape) {
        svg.appendChild(shape);
      }
  
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', `${x + 15}`);
      label.setAttribute('y', `${y - 25}`);
      label.setAttribute('font-size', '28');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('fill', 'black');
      label.textContent = vertex.name;
      svg.appendChild(label);
  
      requestAnimationFrame(() => {
        const textBox = label.getBBox();
        const lines = Array.from(svg.querySelectorAll('line, path')) as (SVGLineElement | SVGPathElement)[];
        for (const line of lines) {
          const lineBox = line.getBBox();
          const isOverlap =
            textBox.x + textBox.width > lineBox.x &&
            textBox.x < lineBox.x + lineBox.width &&
            textBox.y + textBox.height > lineBox.y &&
            textBox.y < lineBox.y + lineBox.height;
  
          if (isOverlap) {
            const labelOffsetX = -70;
            label.setAttribute('x', `${textBox.x + labelOffsetX}`);
            label.setAttribute('y', `${textBox.y}`);
            label.setAttribute('fill', 'black');
            break;
          }
        }
      });
    }
  }
  

 
}
