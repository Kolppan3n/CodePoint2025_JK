export interface resJson {
  status: string;
  result: [];
}

export interface Tila {
  id?: number;
  nimi: string;
}

export interface Varaaja {
  id?: number;
  nimi: string;
}

export interface Varaus {
  id?: number;
  tilaId: number;
  varaajaId: number;
  varauspaiva: Date;
}
