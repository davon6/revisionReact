// controllers/Controller.js
const infoPubli = require('../models/InfoPubli.js');


async function getAllInfoPubli(req, res) {
  try {


    const records = await infoPubli.getAllInfoPubli();

    console.log("##################################################################################");

//console.log(records.toString())

    res.json(records);


  } catch (error) {
    console.error('Error in getAllUsersComp controller:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

/*
async function exportFlux(req, res) {
  try {


    const records = await infoPubli.exportFlux();

    console.log("##################################################################################");

//console.log(records.toString())

    res.json(records);


  } catch (error) {
    console.error('Error in getAllUsersComp controller:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
*/

function exportFlux(req, res) {
     
  //console.log(req.body.dataRestored)

  infoPubli.exportFlux(req.body.dataRestored);
  // Respond to the client as needed
  res.status(200).json({ message: 'Data received successfully' });
}




async function getAllColumnNamesInfoPubli(req, res) {
    try {
  
  
      const records = await infoPubli.getAllColumnNamesInfoPubli();
  
      //console.log(records.toString);
  
      res.json(records);
  
  
    } catch (error) {
      console.error('Error in getAllUsersComp controller:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

module.exports = {
    getAllInfoPubli,
  getAllColumnNamesInfoPubli,
  exportFlux
};
 