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
    const chartSize$ = new Observable<Rectangle>((subscriber) => {
      const el = this.containerRef.nativeElement;
      const emit = () => {
        const rect = el?.getBoundingClientRect();
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

    // Ensure signals and effect run inside injection context
    runInInjectionContext(this.injector, () => {
      this.rect = toSignal(chartSize$, { requireSync: true });

      effect(() => {
        const svg = this.svgElementRef?.nativeElement;
        if (!svg) return;

        const [w, h] = this.rect().end;

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

    for (const vertex of this.laneData.vertices) {
      const [x, y] = vertex.location.coordinates.map((v) => v * this.scaleFactor);

      for (const adj of vertex.adjacent) {
        const target = this.laneData.vertices[adj.adjacentVertex];
        const [x2, y2] = target.location.coordinates.map((v) => v * this.scaleFactor);

        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', `${x}`);
        line.setAttribute('y1', `${y}`);
        line.setAttribute('x2', `${x2}`);
        line.setAttribute('y2', `${y2}`);
        line.setAttribute('stroke', '#b3b3ff');
        line.setAttribute('stroke-width', '30');
        svg.appendChild(line);
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
          const defs = document.createElementNS(svgNS, 'defs');
          const linearGradient = document.createElementNS(svgNS, 'linearGradient');
          linearGradient.setAttribute('id', 'grad1');

          const stop1 = document.createElementNS(svgNS, 'stop');
          stop1.setAttribute('offset', '0%');
          stop1.setAttribute('stop-color', 'yellow');
          linearGradient.appendChild(stop1);

          const stop2 = document.createElementNS(svgNS, 'stop');
          stop2.setAttribute('offset', '100%');
          stop2.setAttribute('stop-color', 'red');
          linearGradient.appendChild(stop2);

          defs.appendChild(linearGradient);
          svg.appendChild(defs);

          shape = document.createElementNS(svgNS, 'ellipse');
          shape.setAttribute('cx', `${x}`);
          shape.setAttribute('cy', `${y}`);
          shape.setAttribute('rx', `25`);
          shape.setAttribute('ry', `15`);
          shape.setAttribute('fill', 'url(#grad1)');
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

  // Check all lines for overlap with this label
  const lines = Array.from(svg.querySelectorAll('line')) as SVGLineElement[];
  for (const line of lines) {
    const lineBox = line.getBBox();

    const isOverlap =
      textBox.x + textBox.width > lineBox.x &&
      textBox.x < lineBox.x + lineBox.width &&
      textBox.y + textBox.height > lineBox.y &&
      textBox.y < lineBox.y + lineBox.height;

    if (isOverlap) {
      // Mirror the label horizontally
      const labelOffsetX = -70; // move 115px to the left of center
      label.setAttribute('x', `${textBox.x + labelOffsetX}`);
      label.setAttribute('y', `${textBox.y}`); // or adjust as needed
      label.setAttribute('fill', 'black'); // optional: mark overlapping text
      break;
    }
  }
});
    }
  }

 
}
