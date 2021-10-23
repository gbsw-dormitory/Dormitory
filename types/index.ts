export interface User {
  uid: string;
  id: number;
  name: string;
  sex: number;
  phone: number;
  address: string;
  permission: number;
}

export interface ApiKey {
  token: string
  uid: string
  created: Date
  desc: string
}
