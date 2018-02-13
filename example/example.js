"use strict";

const MySQLDBHandler = require('../lib/mysqldb-handler');
const mysql = new MySQLDBHandler({
    connectionLimit: 100,
    waitForConnections: false,
    multipleStatements: true,
    host: '{HOSTNAME}',
    port: 3306,
    user: '{USERID}',
    password: '{PASSWORD}',
    database: '{DATABASE}'
});

(async() => {

    /**
     * Single Query 1st
     * @type {*}
     */
    let res1 = await mysql.connect(async(conn) => {
        return await conn.query('select * from TEST where SEQ=?', [44]);
    });
    console.log(res1);

    /**
     * Single Query 2nd
     * @type {*|Promise<*>}
     */
    let res2 = await mysql.connect(conn => conn.query('select * from TEST where SEQ=?', [44]));
    console.log(res2);

    /**
     * Transaction Query example
     * @type {T}
     */
    let res3 = await mysql.transaction(async (conn) => {
        await conn.query('insert into TEST (NAME) VALUES (?)', ['Hello']);
        await conn.query('update TEST set NAME = "World" where NAME = ?', ['Hello']);
        return 'OK';
    });
    console.log(res3);

})().catch(err => {
    console.error(err);
});