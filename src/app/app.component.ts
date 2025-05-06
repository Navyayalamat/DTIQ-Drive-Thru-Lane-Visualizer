import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { SvgImageComponent } from '../svg-image/svg-image.component';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Lane } from '../common-interface';
import { ResponsiveSvgComponent } from '../demo-svg/demo-svg.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule , ResponsiveSvgComponent,MatSelectModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
  http = inject(HttpClient);
  showDropDown = true;
  lanes: Lane[] = [];
  title: string = 'Drive-Thru Lane Visualizer';
  selectedLaneId: string = '';
  selectedLane = {} as Lane;
  
  constructor() { }

  ngOnInit(){
    this.http.get<Lane[]>('api/lanes').subscribe(data => {
      this.lanes = data;
      this.selectedLaneId = this.lanes[0].id;
      this.selectedLane = this.lanes[0];
    });
    setTimeout(() => {
      this.showDropDown = false;
    }, 10000);
  }

  laneChanged(event:any):void{
    this.selectedLaneId = event.value;
    this.selectedLane = this.lanes.filter(item => item.id === event.value)[0];
  }

 
}
