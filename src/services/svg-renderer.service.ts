import { Injectable } from '@angular/core';
import { Lane } from '../common-interface';

@Injectable({
  providedIn: 'root'
})
export class SvgRendererService {

  generateSvg(laneData: Lane, scale = 50): string {
    const width = 1000;
    const height = 800;

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    for (const vertex of laneData.vertices) {
      const [x, y] = vertex.location.coordinates.map(c => c * scale);
      const color = vertex.vertexType === 'SERVICE_POINT' ? 'blue' : 'red';

      svgContent += `
        <circle cx="${x}" cy="${y}" r="8" fill="${color}" />
        <text x="${x + 10}" y="${y}" font-size="28px" fill="black">${vertex.name}</text>
      `;

      for (const adj of vertex.adjacent) {
        const target = laneData.vertices[adj.adjacentVertex];
        const [x2, y2] = target.location.coordinates.map(c => c * scale);

        svgContent += `
          <line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="30" />
        `;
      }
    }

    svgContent += `</svg>`;
    return svgContent;
  }
}
