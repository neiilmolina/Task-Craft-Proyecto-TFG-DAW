export interface Type {
  idType: number;
  type: string;
  color: string;
  idUser: string;
}

export interface TypeCreate {
  type: string;
  color: string;
  idUser: string;
}

export interface TypeUpdate {
  type: string;
  color: string;
  idUser?: string;
}
