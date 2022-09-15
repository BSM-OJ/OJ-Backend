import { Module } from "@nestjs/common";
const mariadb = require('mariadb');
  
export const MD_CONNECTION = 'MD_CONNECTION';

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER, 
    password: process.env.DB_PW,
    connectionLimit: 5
});

const dbProvider = {
    provide: MD_CONNECTION,
    useValue : Object.freeze({
        pool: pool
    }),
};

@Module({
    providers: [dbProvider],
    exports: [dbProvider],
})
export class DbModule {}
  