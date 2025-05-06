import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgImageComponent } from './svg-image.component';
import { Lane } from '../common-interface';

describe('SvgImageComponent', () => {
  let component: SvgImageComponent;
  let fixture: ComponentFixture<SvgImageComponent>;
  let laneData =  {
    "id": "680bc0",
    "name": "Lane 1",
    "vertices": [
  
      {
  
        "id": 0,
  
        "name": "Pre-Warn",
  
        "vertexType": "SERVICE_POINT",
  
        "isEntry": true,
  
        "location": {
  
          "coordinates": [
  
            18.0,
  
            2.0
  
          ]
  
        },
  
        "adjacent": [
  
          {
  
            "adjacentVertex": 1,
  
            "interiorPath": []
  
          }
  
        ]
  
      },
  
      {
  
        "id": 1,
  
        "name": "Order",
  
        "vertexType": "SERVICE_POINT",
  
        "isEntry": false,
  
        "location": {
  
          "coordinates": [
  
            18.0,
  
            7.0
  
          ]
  
        },
  
        "adjacent": [
  
          {
  
            "adjacentVertex": 2,
  
            "interiorPath": [
  
              {
  
                "coordinates": [
  
                  18,
  
                  9.5
  
                ]
  
              }
  
            ]
  
          }
  
        ]
  
      },
  
      {
  
        "id": 2,
  
        "name": "Cash",
  
        "vertexType": "SERVICE_POINT",
  
        "isEntry": false,
  
        "location": {
  
          "coordinates": [
  
            8.0,
  
            9.5
  
          ]
  
        },
  
        "adjacent": [
  
          {
  
            "adjacentVertex": 3,
  
            "interiorPath": []
  
          }
  
        ]
  
      },
  
      {
  
        "id": 3,
  
        "name": "Present",
  
        "isEntry": false,
  
        "location": {
  
          "coordinates": [
  
            0.5,
  
            9.5
  
          ]
  
        },
  
        "adjacent": []
  
      }
  
    ]
  } as Lane;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgImageComponent);
    component = fixture.componentInstance;
    component.laneData = laneData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
