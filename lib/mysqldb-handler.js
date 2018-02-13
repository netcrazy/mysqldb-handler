"use strict";

const mysql = require('promise-mysql');

/**
 * MySQLDB Handler
 * @type {module.MySQLDBHandler}
 */
module.exports = class MySQLDBHandler{

    /**
     * Constructor
     * @param config
     */
    constructor(config) {
        this._pool = mysql.createPool(config);
    }

    /**
     * MySQL Query
     * @param fn
     * @returns {Promise<*>}
     */
    async connect(fn) {
        const conn = await this._pool.getConnection();
        const result = await fn(conn).catch(error => {
            conn.connection.release();
            throw error;
        });
        conn.connection.release();
        return result;
    }

    /**
     * MySQL Transaction Query
     * @param fn
     * @returns {Promise<*>}
     */
    async transaction(fn) {
        const conn = await this._pool.getConnection();
        await conn.connection.beginTransaction();

        const result = await fn(conn).catch(async (error) => {
            await conn.rollback();
            conn.connection.release();
            throw error;
        });

        await conn.commit();

        conn.connection.release();
        return result;
    }
};