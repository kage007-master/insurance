interface AuthState {
  token: string;
  user: {
    id: number;
    role: string;
    fullname: string;
    username: string;
    email: string;
  };
}

interface CoverageState {
  coverages: any[];
}

interface ClientState {
  clients: any[];
  client: any;
}
