import { Module } from "@nestjs/common";
const mariadb = require('mariadb');
  
export const MD_CONNECTION = 'MD_CONNECTION';

const pool = mariadb.createPool({
    host: 'localhost', 
    port: 3307,
    user:'root', 
    password: 'centos',
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
  