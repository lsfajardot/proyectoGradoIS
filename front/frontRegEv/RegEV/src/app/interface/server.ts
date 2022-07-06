import { Type } from "../enum/status.enum";

export interface Server {
  id: number;
  direccion: string;
  latitud: number;
  longitud: number;
  tipo: string;
  fecha: string;
}
