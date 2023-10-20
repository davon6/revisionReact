const oracledb = require('oracledb');
const fs = require('fs');
const pdf = require('html-pdf');

const dbConfig = {
  user: 'docpilot',
  password: 'docpilot',
  connectString: 'localhost:1521/DBTEST', // Replace with your Oracle connection string
  // other optional configuration options can be added here
};
/*
async function getAllInfoPubli() {

   
    

  let connection;

  try {
    // Establish a database connection
    connection = await oracledb.getConnection(dbConfig);

    // Execute a query
    const query = 'SELECT * FROM INFOPUBLI'; 
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

*/

async function getAllInfoPubli() {
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
      const query = 'SELECT * FROM INFOPUBLI'; 
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


  async function exportFlux(template){
    //console.log(template)

    const inFoPubli = await getAllInfoPubli();
    //console.log('Info PubliPostage Records:', inFoPubli);

    //console.log('Info PubliPostage Records:', inFoPubli[0][2]);


    let final = "";
    let vessel = "";

    const regex = /<xsl:value-of[^>]*dffui:value="(.*?)"[^>]*>/g;


    //


    const matches = template.match(regex);
  
    if (matches) {


      for(let i=0;i < inFoPubli.length; i++){

        vessel = template;
  //console.log(inFoPubli.length);


  //console.log(inFoPubli[i][1] );

  //console.log("valuuuuuuuuuuuuuuuuuuue    : "+matches );

      // Iterate over the matches and replace them in the content
      matches.forEach((match) => {
        // Extract the value from the dffui:value attribute

        
        const value = match.match(/dffui:value="(.*?)"/)[1];
      //  console.log("valuuuuuuuuuuuuuuuuuuue    : "+value );


         
//let i =0;

        let select = "";
        switch(value){
          case 'ENTREPRISE_NOM': select = inFoPubli[i][1] ; break;
          case 'RUE': select = inFoPubli[i][2] ; break;
          case 'VILLE': select = inFoPubli[i][3] ; break;
          case 'CODEPOSTAL': select = inFoPubli[i][4] ; break;
          case 'REGIMESOCIAL': select = inFoPubli[i][5] ; break;
          case 'TELEPHONE': select = inFoPubli[i][6] ; break;
          case 'COURRIEL': select = inFoPubli[i][7] ; break;
          case 'CONSEILLER_NOM': select = inFoPubli[i][8] ; break;



          case 'ISAAC NEWTON': select = inFoPubli[i][1] ; break;
          case 'AV GABRIEL PERI': select = inFoPubli[i][2] ; break;
          case 'DUNKERQUE': select = inFoPubli[i][3] ; break;
          case '00000': select = inFoPubli[i][4] ; break;
          case 'Régime Général': select = inFoPubli[i][5] ; break;
          case '01 11 11 11 11': select = inFoPubli[i][6] ; break;
          case 'rfttttn@XXXXXXX.fr': select = inFoPubli[i][7] ; break;
          case 'DUPOND test': select = inFoPubli[i][8] ; break;



           }

           console.log(select );

        vessel = vessel.replace(
          match,
          match.substring(0, match.length - 1) + ` class="xsl-value">${select}`)

          

        
            //console.log(i + "                                                " +final );
        
        }); 
  
    if(final===""){ final = vessel}else{
      final = final + '<div style="page-break-before: always;"></div> <div style="page-break-before: always;"></div>'+ vessel;}
  
  
  
  }  


}

   // Create a PDF document
// Options for PDF generation
const pdfOptions = {
  format: 'Letter', // or 'A4', 'Legal', etc.
  border: '10mm',  // Set page margins
  timeout: 12000,
};

// Generate PDF and save it to a file
pdf.create(final, pdfOptions).toFile('./export/output.pdf', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('PDF generated successfully.');
  }
  
  })



};

async function getAllColumnNamesInfoPubli() {

    
      let connection;
    
      try {
        // Establish a database connection
        connection = await oracledb.getConnection(dbConfig);
    
        // Execute a query
        const query ="SELECT column_name FROM user_tab_columns WHERE table_name = 'INFOPUBLI'";
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
    const usersRecords = await getAllInfoPubli();
    console.log('UsersComp Records:', usersRecords);

console.log('accompagned with ' + usersRecords[0][7]);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();


module.exports = {
    getAllInfoPubli,
    getAllColumnNamesInfoPubli,
    exportFlux
  };
  