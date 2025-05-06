import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { SvgImageComponent } from '../svg-image/svg-image.component';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Lane } from '../common-interface';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule , SvgImageComponent,MatSelectModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
  http = inject(HttpClient);
  lanes: Lane[] = [];
  title: string = 'Drive-Thru Lane Visualizer';
  selectedLaneId: string = '';
  selectedLane = {} as Lane;
  @ViewChild('scaleWrapper' , {static: false})  scaleWrapper!: ElementRef
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.scaletoFit();
  }
  
  constructor() { }

  ngOnInit(){
    this.http.get<Lane[]>('api/lanes').subscribe(data => {
      this.lanes = data;
      this.selectedLaneId = this.lanes[0].id;
      this.selectedLane = this.lanes[0];
    });
  }

  laneChanged(event:any):void{
    this.selectedLaneId = event.value;
    this.selectedLane = this.lanes.filter(item => item.id === event.value)[0];
  }

  scaletoFit(){
    // const baseWidth = 1920;
    // const baseHeight = 1080;
    // const margin = 0.05;
    // const maxScaleWidth  = window.innerWidth/ baseWidth;
    // const maxScaleHeight = window.innerHeight/ baseHeight;
    // const scale = Math.min(maxScaleWidth, maxScaleHeight)*(1-margin);
    // this.scaleWrapper.nativeElement.style.transform = `translate(-50%, -50%) scale(${scale})`
    const body = document.body;
    const html = document.documentElement;
    const width  = window.innerWidth;
    const height = window.innerHeight;
    body.style.width = width + 'px';
    body.style.height = height + 'px';
    html.style.width = width + 'px';
    html.style.height = height + 'px';
  }
}
