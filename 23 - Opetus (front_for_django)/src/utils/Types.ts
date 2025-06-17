export type ApiResponse = {
  status: string;
  message: string;
  data: [];
};

export type LoginResponse = {
  refresh: string;
  access: string;
};

export type Kayttaja = {
  id: number;
  nimi: string;
  rooli: string;
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
  tila_nimi: string;
  vajaaja_nimi: string;
  varauspaiva: string;
}

