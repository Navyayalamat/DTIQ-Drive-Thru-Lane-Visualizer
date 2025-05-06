import { CommonModule } from '@angular/common';
import {  Component, HostListener, Input } from '@angular/core';
import { Lane } from '../common-interface';
import { SvgRendererService } from '../services/svg-renderer.service';
 import { InjectionToken } from '@angular/core';
@Component({
  selector: 'app-svg-image',
  imports: [CommonModule],
  templateUrl: './svg-image.component.html',
  styleUrl: './svg-image.component.scss',
})
export class SvgImageComponent {
  @Input() laneData = {} as Lane;
  scaleFactor:number = 30;
  svgWidth:number = 0; 
  svgHeight:number = 0 ; 
  svgHtml: string = '';
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.scaletoFit();
  }

  constructor(private svgRenderer: SvgRendererService){}

  ngOnInit(){
    console.log("data lane", this.laneData)
    // this.renderSvg();
    this.scaletoFit();
  
  }

  renderSvg() {
    this.svgHtml = this.svgRenderer.generateSvg(this.laneData);
  }

 

  // generateSmoothPath(start: any, end: any): string {
  //   const x1 = start.location.coordinates[0] * this.scaleFactor;
  //   const y1 = start.location.coordinates[1] * this.scaleFactor;
  //   const x2 = end.location.coordinates[0] * this.scaleFactor;
  //   const y2 = end.location.coordinates[1] * this.scaleFactor;
  
  //   const cx1 = x1 + (x2 - x1) / 2;
  //   const cy1 = y1;
  //   const cx2 = x1 + (x2 - x1) / 2;
  //   const cy2 = y2;
  
  //   return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  // }

  scaletoFit(){
    // const baseWidth = 1920;
    // const baseHeight = 1080;
    // const margin = 0.05;
    // const maxScaleWidth  = window.innerWidth/ baseWidth;
    // const maxScaleHeight = window.innerHeight/ baseHeight;
    // const scale = Math.min(maxScaleWidth, maxScaleHeight)*(1-margin);
    // this.scaleWrapper.nativeElement.style.transform = `translate(-50%, -50%) scale(${scale})`
    this.svgWidth = window.innerWidth;
    this.svgHeight = window.innerHeight;
    console.log("1212121",window.innerWidth);
  }


   
}
