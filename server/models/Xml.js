const fs = require('fs');
const xml2js = require('xml2js');
const prettier = require('prettier');
/*
function readXmlFileAsText('./MUTUELLE.txt', callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  }

  */
function readXmlFile() {
    return new Promise((resolve, reject) => {
      fs.readFile('./ESPACEVERT/APPEL.dff', 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }


/*


function readXmlFile(callback) {
    fs.readFile('./MUTUELLE.xml', 'utf8', (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        // Pass the data to the callback
        callback(null, data);
      }
    });
  }
*/
/*

function extractSubstring() {
    //xmlData, startMarker, endMarker

   // const xmlData = readXmlFile();


   return readXmlFile()
    .then((xmlData) => {
      // Process the xmlData as needed
      console.log(xmlData); // Example: Log the XML data
      return xmlData;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

    const startIndex = xmlData.indexOf("<");
    const endIndex = xmlData.indexOf(">");
    
    


    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      return xmlData.substring(startIndex, endIndex + endMarker.length);
    } else {
      return null; // The markers were not found in the XML data
    }*/
  //}

/*
  deterTagValues((err, xmlData) => {
    if (err) {
      console.error(err);
    } else {
      const substring = extractSubstring(xmlData, '<start>', '</end>');
      if (substring) {
        console.log(substring);
      } else {
        console.log('Markers not found in XML data.');
      }
    }
  });
*/





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

function interMed(text){
//const filePath = './maTemplate.dff'; // Replace with your XML file path


const filePath = './ESPACEVERT/APPEL.dff'; // Replace with your XML file path
readXmlFileAsText(filePath, (err, dffText) => {
  if (err) {
    console.error(err);
  } else {


   // console.log(prettier.format(dffText, { parser: 'html', printWidth: 80 }));
/*
    xml2js.parseString(dffText, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }
    
      // Convert the JavaScript object back to a string
      const xmlString = new xml2js.Builder().buildObject(result);
      dffText = xmlString
      // Now, xmlString contains the XML content as a string
      //console.log(xmlString);
    })
   // console.log(dffText);   
*/

    // to use with the value from react ${newText1}  ${newText2}
    //dffText = dffText.replace('<span>tester</span>', `<span>${newText1}</span>`);
    // dffText = dffText.replace('<li>ensemble</li>', `<li>${newText2}</li>`);
// Your new content for the body
//const newText1 = '<p>New content for the body</p>';



 

const regexBody = /<body [^>]*>([\s\S]*?)<\/body>/i;
const contentBeforeBody = dffText; // Replace with your XML content


//console.log( regexBody.exec(dffText));

const [,  existingBodyContent] = contentBeforeBody.match(regexBody);

//console.log("existingbodycontent      " +contentBeforeBody.match(regexBody));
//console.log("existingbodycontent      " +existingBodyContent[0]); // Content between <body> tags

//console.log("text is text : " + text);
/*
console.log("existingbodycontent      " +
dffText.replace( existingBodyContent , ""));
*/

//console.log("textexttext      " + text.replace(/.*<div id="layout-iqwi" dffui/gs,'<div id="layout-iqwi" dffui'));












let elementsToIndent = ['div', 'p'];
  let indent = 2
  let formattedText = '';
  let currentIndent = 0;
let xmlText = text;


for (let i = 0; i < xmlText.length; i++) {
  const char = xmlText[i];
  const nextChar = xmlText[i + 1];

  if (char === '<' && nextChar !== '/') {
    const tagStart = i;
    const tagEnd = xmlText.indexOf('>', tagStart) + 1;
    const tag = xmlText.slice(tagStart, tagEnd);

    if (elementsToIndent.includes(tag.toLowerCase())) {
      // Increase the current indent
      currentIndent += indent;
      if (currentIndent < 0) {
        currentIndent = 0; // Avoid negative indent
      }
      formattedText += '\n' + ' '.repeat(currentIndent);
    }

    formattedText += tag;
    i = tagEnd - 1;
  } else if (char === '<' && nextChar === '/') {
    // Decrease the current indent
    currentIndent -= indent;
    if (currentIndent < 0) {
      currentIndent = 0; // Avoid negative indent
    }
    formattedText += '\n' + ' '.repeat(currentIndent) + char;
  } else {
    formattedText += char;
  }
}

dffText = dffText.replace( existingBodyContent ,  formattedText.replace(/.*<div id="layout-iqwi" dffui/gs,'<div id="layout-iqwi" dffui'));


    fs.writeFile('./ESPACEVERT/APPEL.dff', dffText, (err) => {
      if (err) {
        console.error('Error writing HTML file:', err);
      } else {
        console.log('HTML file has been rewritten successfully.');
        //console.log(dffText);
      }})
    //magik starts here with xmlText variable
  }});

}





module.exports = {
  readXmlFile,
  interMed
 // readXmlFileAsText
  //extractSubstring,
 // deterTagValues
};
