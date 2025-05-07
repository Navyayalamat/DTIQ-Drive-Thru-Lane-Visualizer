import { CommonModule } from '@angular/common';
import {  Component, Input, OnInit } from '@angular/core';
import { Lane } from '../common-interface';
@Component({
  selector: 'app-svg-image',
  imports: [CommonModule],
  templateUrl: './svg-image.component.html',
  styleUrl: './svg-image.component.scss',
})
export class SvgImageComponent implements OnInit {
  @Input() laneData = {} as Lane;
  scaleFactor = 30;
  svgWidth = 0; 
  svgHeight = 0 ; 
  
  ngOnInit(){
    console.log("data lane", this.laneData)
  }

    
}
