const express = require('express');
const cors = require('cors'); // For handling CORS
const premRoutes = require('./routes/prem'); // Import your routes
const allUsersRoute = require('./routes/usersComp'); // Import your routes
const infoRoute = require('./routes/infoPubli'); // Import your routes
const https = require('https');
const fs = require('fs');
const app = express();
//const xmlBodyParser = require('express-xml-bodyparser');

//app.use(xmlBodyParser());

// Load the PKCS12 (PFX) file and specify the passphrase
const pfxFilePath = '../keystore.pfx'; // Update with your PKCS12 file path
const passphrase = 'changeit'; // Replace with your passphrase

// Read the PKCS12 file
const pfx = fs.readFileSync(pfxFilePath);

// Create the HTTPS server
const server = https.createServer({
  pfx: pfx,
  passphrase: passphrase,
}, app);


const xml2js = require('xml2js');
app.use(express.text({ type: 'application/xml' }));


app.post('/xml-endpoint', (req, res) => {
  const xmlData = req.body; // Parsed XML data

  // Convert XML to JavaScript object using xml2js
  xml2js.parseString(xmlData, (err, result) => {
    if (err) {
      // Handle parsing errors here
      console.error(err);
      res.status(400).send('Invalid XML data');
      return;
    }
 
    // Process the JavaScript object
    const jsonData = result;

    // Send a response (possibly in XML format)
    // ...

    res.set('Content-Type', 'application/xml');
    res.send(/* Your XML response data */);
  });
});


// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() to parse JSON data

app.use('/api', premRoutes); // Use '/api' as the base URL for your routes

 
app.use('/api', allUsersRoute);


app.use('/api', infoRoute);
const infoContr = require('./controllers/infoPubli');
// Define a route that handles both GET and POST requests for /expFlux
app.route('/expFlux')
   .get(infoContr.exportFlux) // Handle GET requests
   .post(infoContr.exportFlux); // Handle POST requests


//app.post('/interMed', xmlController.interMed);
/*
const infoContr = require('./controllers/infoPubli');
app.post('/expFlux', infoContr.exportFlux);
*/

//const infoContr = require('./controllers/infoPubli'); // Import your routes

//infoContr.getAllInfoPubli();

//app.use('/api', allInfoRoute.getAllInfoPubli);


 /*
app.post('./myXml.xml', (req, res) => {
  const xmlData = req.body; // Parsed XML data

  // Process the XML data here
  // ...

  // Send a response (possibly in XML format)
  res.set('Content-Type', 'application/xml');
  res.send(
   Your XML response data 
     
     );
});

*/

/*

function hey () {  console.log("hello");};
app.get('/valueXml', (req, res) => {
  try {
    hey();
    res.send('Response sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});*/

const xmlController = require('./controllers/xml');
 
const xmlModel = require('./models/Xml');
 
app.get('/display-xml', xmlController.displayXml);

app.get('/jeez', xmlController.displayXmlasText);

//DUPLICATES WILL BE PAINFULL TO HANDLE UNLESS a wrap a huge portion of text around my new value
app.post('/interMed', xmlController.interMed);





/*
app.post('/interMed', { newText1: 'tester1', newText2: 'ensemble2' })
  .then((response) => {
    console.log('Request successful:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

*/
 
let isDisplayXmlInProgress = false;

async function extractSubstring(req, res) {
  try {
    // Check if the displayXml function is already in progress
    if (isDisplayXmlInProgress) {
      res.status(400).send('Another request is in progress. Please try again later.');
      return;
    }

    // Set the flag to indicate that displayXml is in progress
    isDisplayXmlInProgress = true;

    // Call the displayXml function from the controller to get the XML data
    const xmlData = await xmlController.displayXml(req, res);

    if (xmlData !== undefined) {
      // Log the xmlData to see what's coming from displayXml
      console.log('xmlData:', xmlData);

      // Perform substring operation here
      const substringResult = xmlData.substring(0, 100); // Example: Get the first 100 characters

      // Log the substring result
      console.log('substringResult:', substringResult);

      // Send the substring result in the response
      res.send(substringResult);
    } else {
      // Handle the case where xmlData is undefined
      console.error('xmlData is undefined');
      res.status(500).send('Error: xmlData is undefined');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err.message); // Send an error response
  } finally {
    // Reset the flag when processing is complete
    isDisplayXmlInProgress = false;
  }
}

  

app.get('/valueXml', extractSubstring);



/*
const xmlModel = require('./models/Xml');

app.get('/valueXml', async (req, res) => {
  try {
    const xmlData = await xmlModel.extractSubstring();
    res.send(xmlData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

*/


// Start the HTTPS server
const port = process.env.PORT || 4443;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





/* FONCITONNELLE SUBSTRING TAG VALUES

function readXmlFileAsText(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

// Usage example
const filePath = './MUTUELLE.xml'; // Replace with your XML file path
readXmlFileAsText(filePath, (err, xmlText) => {
  if (err) {
    console.error(err);
  } else {
    console.log(xmlText); // The XML content as plain text
    //const regex = /<([^<>\/]*)>/g; // Updated regex
    const regex = /<([^>]*)>/g;
    const matches = [];
    const fArr = [];
    let match;
  
    while ((match = regex.exec(xmlText))) {
      matches.push(match[0]);
    }
  
    // Process and use the extracted values
    for (const value of matches) {
      console.log(value);
      fArr.push(value)
    }


    const formattedOutput = matches.map((value) => `  ${value}`).join('\n'); // Add indentation
  fs.writeFile('output.txt', formattedOutput, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }

    console.log('Values saved to output.txt with indentation');
  })










   // fs.writeFile('output.txt', matches.join('\n'), (err) => {
      //if (err) {
      //  console.error('Error writing file:', err);
      //  return;
    //  }
  
  //    console.log('Values saved to output.txt');
  //  });

   // console.log(fArr.toString())





  }
});


//ends here
*/ 