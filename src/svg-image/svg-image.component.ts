import { CommonModule } from '@angular/common';
import {  Component, Input } from '@angular/core';
import { Lane } from '../common-interface';

@Component({
  selector: 'app-svg-image',
  imports: [CommonModule],
  templateUrl: './svg-image.component.html',
  styleUrl: './svg-image.component.scss',
})
export class SvgImageComponent {
  @Input() laneData = {} as Lane;
  scaleFactor:number = 30;
  svgWidth:number = 1920; 
  svgHeight:number = 1080; 

  constructor(){}

  ngOnInit(){
    console.log("data lane", this.laneData)
  }

   
}
