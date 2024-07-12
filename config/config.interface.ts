interface IJWT {
  accessTokenSecret: string;
  accessTokenExpiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration;
}

interface IMailer {
  email: string;
  password: string;
  host: string;
}

interface IDatabase {
  host: string;
  type: string;
  name: string;
  port: number;
  // url: string;
  username: string;
  password: string;
  database: string;
  entities: string[];
  synchronize: boolean;

  migrationsRun?: boolean;
  logging?: boolean;
  autoLoadEntities?: boolean;
  migrations?: string[];
  migrationsTableName: string;
  cli?: {
    migrationsDir?: string;
  };
}

interface IDatabase2 {
  host: string;
  type: string;
  name: string;
  port: number;
  // url: string;
  username: string;
  password: string;
  database: string;
}

interface IAgora  {
  appId:string,
  appCertificate:string,
  customerKey: string,
  customerSecret: string
}

export interface IConfig {
  port: number;
  database: IDatabase;
  database2: IDatabase2
  jwt: IJWT;
  mailer: IMailer;
  agora:IAgora
  newPasswordBytes: number;
  codeBytes: number;
  infobipKey:string;
  firebaseConfig:any;
  infobipBaseUrl: string;
  HTTP_TIMEOUT: number;
  HTTP_MAX_REDIRECTS: number,
}
