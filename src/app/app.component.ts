import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,  inject, OnInit } from '@angular/core';
// import { SvgImageComponent } from '../svg-image/svg-image.component';
import { MatSelectModule} from '@angular/material/select';
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

export class AppComponent implements OnInit {
  http = inject(HttpClient);
  showDropDown = true;
  lanes: Lane[] = [];
  title = 'Drive-Thru Lane Visualizer';
  selectedLaneId = '';
  selectedLane = {} as Lane;
  
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
