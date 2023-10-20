const oracledb = require('oracledb');

const dbConfig = {
  user: 'docpilot',
  password: 'docpilot',
  connectString: 'localhost:1521/DBTEST', // Replace with your Oracle connection string
  // other optional configuration options can be added here
};

async function getAllUsersRecords() {
/*
    console.log('Connecting to the database...');
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to the database.');
    await connection.close();

    */

  let connection;

  try {
    // Establish a database connection
    connection = await oracledb.getConnection(dbConfig);

    // Execute a query
    const query = 'SELECT * FROM usersComp'; 
    const result = await connection.execute(query);
   //console.log('Query Result:', result);
    // Process the query result
    //console.log('Query Result:', result.rows);
   // return result
    return result.rows; // Assuming you want to return the rows
  } catch (error) {
    console.error('Oracle DB error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        // Release the database connection when done
        await connection.close();
      } catch (error) {
        console.error('Error closing Oracle DB connection:', error);
      }
    }
  }


  
}

// Usage example:
async function main() {
  try {
    const usersRecords = await getAllUsersRecords();
    console.log('UsersComp Records:', usersRecords);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();


module.exports = {
    getAllUsersRecords,
  };
  