export interface Vertex {
    id: number;
    name: string;
    vertexType?: string;
    isEntry: boolean;
    location: {
      coordinates: [number, number];
    };
    adjacent: {
      adjacentVertex: number;
      interiorPath: { coordinates: [number, number] }[];
    }[];
  }
  
export interface Lane {
    id: string;
    name: string;
    vertices: Vertex[];
}
  