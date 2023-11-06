interface AuthState {
  token: string;
  notifications: any[];
  filter: string;
  user: {
    id: number;
    role: string;
    fullname: string;
    username: string;
    email: string;
    balance: number;
    transactions: any[];
    coverages: any[];
    claims: ?number;
    address: ?{
      line1: string;
      line2: ?string;
      city: string;
      latitude: number;
      longitude: number;
    };
    notifications: number;
  };
}

interface CoverageState {
  coverages: any[];
  error: string;
  error_cnt: 0;
}

interface WeatherState {
  weathers: any[];
}

interface StatisticState {
  data: any;
}

interface ClientState {
  clients: any[];
  client: any;
  validators: any[];
}

interface ClaimState {
  claims: any[];
  active: any[];
  past: any[];
  assessed: any[];
  assigned: any[];
}
