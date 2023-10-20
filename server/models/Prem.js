const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'MAXIME',
  user: 'docpilot',
  password: 'docpilot',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

async function getAllPremRecords() {
  return new Promise((resolve, reject) => {
    pool.connect()
      .then((connection) => {
        const request = new sql.Request(connection);

        request.query('SELECT * FROM PREM')
          .then((result) => {
            resolve(result.recordset);
            connection.release();
          })
          .catch((error) => {
            console.error('SQL query error:', error);
            connection.release();
            reject(error);
          });
      })
      .catch((error) => {
        console.error('SQL Server connection error:', error);
        reject(error);
      });
  });
}

module.exports = {
  getAllPremRecords,
};
