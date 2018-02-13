const mysql = require('promise-mysql');

/**
 * MySQLHandler constructor
 * @param config
 * @constructor
 */
function MySQLHandler(config) {
    this._pool = mysql.createPool(config);
}

/**
 * MySQL Connect and Query
 * @param fn
 * @returns {Promise<*>}
 */
MySQLHandler.prototype.connect = async function(fn) {
    const conn = await this._pool.getConnection();
    const result = await fn(conn).catch(error => {
        conn.connection.release();
        throw error;
    });
    conn.connection.release();
    return result;
};

/**
 * MySQL Connect and Query with Transaction
 * @param fn
 * @returns {Promise<*>}
 */
MySQLHandler.prototype.transaction = async function(fn) {

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
};

module.exports = MySQLHandler;