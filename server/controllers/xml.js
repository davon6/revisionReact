const { Xml } = require('mssql');
const xmlModel = require('../models/Xml');


async function displayXml(req, res) {
    try {
      const data = await xmlModel.readXmlFile();
      res.set('Content-Type', 'application/xml');
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error reading XML file');
    }
  }


  async function displayXmlasText(req, res) {
    try {
      const data = await xmlModel.readXmlFileAsText();
      res.set('Content-Type', 'application/xml');
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error reading XML file');
    }
  }

/*
  function interMed(req, res) {
    xmlModel.interMed(() => {
    
    })};
  
*/  

    function interMed(req, res) {
     
      //console.log(req.body.dataRestored)
      xmlModel.interMed(req.body.dataRestored);
      // Respond to the client as needed
      res.status(200).json({ message: 'Data updated successfully' });
    }




/*
function displayXml(req, res) {
  xmlModel.readXmlFile((err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading XML file');
    } else {
      res.set('Content-Type', 'application/xml');
      res.send(data);
    }
  });
}


*/
/*
async function displayXml(req, res) {
    try {
      const xmlData = await xmlModel.readXmlFile();
      res.set('Content-Type', 'application/xml');
      res.send(xmlData);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error reading XML file');
    }
  }
*/
module.exports = {
  displayXml,
  displayXmlasText,
  interMed
};
