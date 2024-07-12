import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

import { IConfig } from './config.interface';

dotenv.config();

const database = {
  host: process.env.DB_HOST,
  type: process.env.DB_TYPE,
  name: 'default',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  autoLoadEntities: true,
  entities: ['./dist/**/*.entity.js'],
  synchronize: true,
  migrations: [`./dist/src/db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migration',
}

const database2 = {
  host: process.env.SECOND_DB_HOST,
  type: process.env.SECOND_DB_TYPE,
  name: 'default',
  port: parseInt(process.env.SECOND_DB_PORT, 10) || 5435,
  username: process.env.SECOND_DB_USERNAME,
  password: process.env.SECOND_DB_PASSWORD,
  database: process.env.SECOND_DB_NAME,
}

 const agora = {
  appId: process.env.appId,
  appCertificate:process.env.appCertificate,
  customerKey: process.env.customerKey,
  customerSecret: process.env.customerSecret
}

export default (): IConfig => ({
  port: parseInt(process.env.PORT, 10) || 8000,

  firebaseConfig:  {
    type: "service_account",
    project_id: "test-af729",
    private_key_id: "30d83a3a24e44c5f5f64bbd045bba74808cf137b",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3KjcyI3Jjo73Z\n9nPb21mIvv0wNTO1aJ5khqaxjTAxlslhVVrFpgPOqTJfsYcOShkQX5fXN4mpoBX1\nsIEOqwi0YV2hBHWdj6hqjEoO0q2ERGWWI7zTCkklAKdMGCUTQt3sB+8qsjWnS85O\nTODdF+xPrxWvoBDrxhH6oot6ATgNA2w+yR4w3PZJnSbC3SGRa89RQbyZk73NxucL\nWM3eEg2es6bf/8DwfYpOav22ot/P9uF/+JQhk7LTTvI8/F9HPoxu+Wfv2oaCWWX5\nLV6X6Ee2v66S9SGfSwuQm2AEEU5jUAMLGsQ3UlzHNSnsjlrN9afKFI2yu7lDQSbz\n82PqnzmTAgMBAAECggEAArdWb4kXB/rvHOjIU8roLurMD0UGjX92Ly1eOHy01rIV\nJH2Mk+/6AghQ4ZWoqK7F8r9SOf/8ZLI4qqAxENvzsiFgrxpKH3kQHf+hP3EZPhEH\n9VyuwL5FHoT7qkZliLjrpIYtvqh9lPjIcH1BlgXADlIA3yNV2ogHLgDlu0OCQK8f\n9N/NjUp02MXaA/SKUIM4Alvlp7UGEouMbU6SzqroHY0O4GNF+6qaBrbZVI9zR24V\nvpJ7PPVLC5k5RC4kjFGAbxkIO+hSj5McN7Gv/7B4MjHHXm9WV7ddyIK0uKUNm0Zt\n3fiewnrO6EHzpS3a7R5rsMged5ZFub2VlL4mnAnQAQKBgQDhdbVTfLrs5/nf/3cJ\nZZx5QATCRtt3eUT4WD+1cmanN6XhLKARq1lDAKPR9nus18eQlTVrgUEMncofiKMc\n7f1tCFGcvi/0+iclXdwgRJdD1pWoXPMvoX3Lwr9dmTpZ+o0QHahmgSsG7mtBQ8SI\nBZlNVgz/6wQsXjqYk4SqPxs6gwKBgQDP+dfV7X8h0Y0oFRsnstwTqVdGzFEOA7C4\nYu6bVStUkJ4qvoPINnh6AEd4qsvYple1iz/LRX1/QxFHNnSeWCEKo2Gl1ZQGjeII\nsAF6/zZuQcBTHFuxEerdLtK/lWCMDLGOLZxv3F/yEsltVkkr1VowXGRRSq7kdkLV\nGayD8S4XsQKBgD4emXREVJh7nfxaveiH56H8wpLoxQVZE2i9n+gVejUufvTYv82+\ngVyVq41pNVA9L84lXk+dkFeyjgM8OXz6Ea5d8WaXfE0qM2j3QHRfkbHuSNPXsGV6\nQFfI88MNOeeawg0jrsd3ZWyGemTEED1OFZwaToCgt0imOczaMF5b/tuTAoGBAI7K\ndwoGGbdabJQMiaxj/P3y0l1lgnEgz4CJTFGR1EInWLD4RPp9i5IYBvouKe8Bpk6a\n4J3rhBKQNZizJrZgw67OJgj57rvhRkO4tAuClhh1RFrLqZiVOK/Lqh6nrLX7MRzw\n6+tRXv6RL4LGL07NGTMC/E1j/VgWaiRtkCi2unLBAoGAGR0Um1M42SGi4hymR8sR\nC8f9r8ltIyUN8GE/Y6QlTLx5+JsMogyNBh+jBTmBH0v1KHIj482iIBw51mams8KG\nl0ZG+QrLKoA+oV3FIAYFWCwmcB+qgSTkMLzm7PRbzjccHhBvDnbIiLMgSa98mq6r\ngKtJXDeG0TrMYHUGI4mci7Q=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-n6rp2@test-af729.iam.gserviceaccount.com",
    client_id: "112029455687136066511",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n6rp2%40test-af729.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  },
  

  database,
  database2,
  agora,

  mailer: {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    host: process.env.HOST,
  },

  jwt: {
    accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  },


  newPasswordBytes: 4,
  codeBytes: 2,
  infobipKey : process.env.INFOBIP_API_KEY,
  infobipBaseUrl : process.env.INFOBIP_BASE_URL,
  HTTP_TIMEOUT: 20000,
  HTTP_MAX_REDIRECTS: 5,
});


export const connectionSource = new DataSource(database as DataSourceOptions);