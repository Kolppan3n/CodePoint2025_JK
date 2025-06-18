export type LoginResponse = {
  refresh: string;
  access: string;
};

export type Tila = {
  id: number;
  nimi: string;
}

export type Varaaja = {
  id: number;
  nimi: string;
}

export type Varaus = {
  id: number;
  tila: Tila;
  varaaja: Varaaja;
  varauspaiva: string;
}

