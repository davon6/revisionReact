import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import '../App.css';


export default function App() {
  const editorRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  //const [data, setData] = useState([]);
  const [publi, setPubli] = useState([]);
  const [clicked, setClicked] = useState(false);

useEffect(() => {


  /*
    axios.get('https://localhost:4443/api//allInfo') // Replace with the actual URL of your API
      .then((response) => {
        setData(response.data); // Update the data state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
   */    

      axios.get('https://localhost:4443/api//allColInfo') // Replace with the actual URL of your API
      .then((response) => {
        setPubli(response.data); // Update the data state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios
      .get('https://localhost:4443/display-xml')
      .then((response) => {
        const xmlContent = response.data;
        const startIndex = xmlContent.indexOf('<body>') + '<body>'.length;
        const endIndex = xmlContent.indexOf('</body>', startIndex);
        const bodyContent = xmlContent.substring(startIndex, endIndex);
        setOriginalContent(bodyContent); // Save the original content
        const formattedContent = replaceXSLValueOfTags(bodyContent); // Format <xsl:value-of> tags
        setHtmlContent(formattedContent); // Set the formatted content

       // console.log(formattedContent);

      })
      .catch((error) => {
        console.error('Error fetching HTML content:', error);
      });

  }, []);


  const handleCellClick = (value) => {
    const editor = editorRef.current;
    if (editor) {
      try {// custom-value-of'contenteditable="false" class="xsl-value"

let select = "";
        switch(value){
          case 'ENTREPRISE_NOM': select = "client/entreprise/nom" ; break;
          case 'RUE': select = "client/entreprise/adresse/rue" ; break;
          case 'VILLE': select = "client/entreprise/adresse/ville" ; break;
          case 'CODEPOSTAL': select = "client/entreprise/adresse/codePostal" ; break;
          case 'REGIMESOCIAL': select = "categorie/regimeSocial" ; break;
          case 'TELEPHONE': select = "client/contactSignataire/telephone" ; break;
          case 'COURRIEL': select = "client/contactSignataire/courriel" ; break;
          case 'CONSEILLER_NOM': select = "assureur/conseiller/nom" ; break;
           }


      const editedValue =`<custom-value-of dffui:value="${value}" select="${select}"` +
        `contenteditable="false" class="xsl-value">${value}</custom-value-of>`


/*
        const editedValue =`<custom-value-of dffui:value="${value}" select="client/entreprise/adresse/ville"` +
        `contenteditable="false" class="xsl-value">${value}</custom-value-of>`*/
        editor.insertContent(editedValue);
      } catch (error) {
        // Handle the error gracefully, e.g., log the error or display an error message.
        console.error('Error inserting content:', error);
      }
    }
  };

    const makePostRequest = (editor) => {
    // Get the content of the TinyMCE editor
    const newText1 = editor.getContent({ format: 'raw' });
   
  
    const dataRestored = restoreXSLValueOfTags(newText1);
 //console.log(dataRestored)

 
    const data = {
      dataRestored,
      newText2: 'Your newText2 value here', // Replace with your newText2 value
    };


  
    axios
      .post('https://localhost:4443/interMed', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Function to replace <xsl:value-of> tags with formatted placeholders
  function replaceXSLValueOfTags(content) {
    // Use a regular expression to find <xsl:value-of> tags with dffui:value attribute
    const regex = /<xsl:value-of[^>]*dffui:value="(.*?)"[^>]*>/g;
    const matches = content.match(regex);
  
    if (matches) {
      // Iterate over the matches and replace them in the content
      matches.forEach((match) => {
        // Extract the value from the dffui:value attribute
        const value = match.match(/dffui:value="(.*?)"/)[1];

        content = content.replace(
          match,
          match.substring(0, match.length - 1) + ` contenteditable="false" class="xsl-value">${value}`)

      });
    }

    const modifiedValue = content.replace(/xsl:value-of/g, 'custom-value-of');
  
    //console.log(modifiedValue)
    return modifiedValue;
  }
  

  // Function to restore original <xsl:value-of> tags from formatted placeholders
function restoreXSLValueOfTags(content) {

     content = content.replace(/custom-value-of/g, 'xsl:value-of');

content = content.replace(/contenteditable="false" class="xsl-value">/g, '>');

// Create a temporary div element to parse the HTML content
const tempDiv = document.createElement('div');
tempDiv.innerHTML = content;

// Find all <xsl:value-of> elements
const xslValueOfElements = tempDiv.querySelectorAll('xsl\\:value-of');

// Iterate through the elements and remove the text content before </xsl:value-of>
xslValueOfElements.forEach((element) => {
  const dffuiValue = element.getAttribute('dffui:value');
  if (dffuiValue) {
    element.textContent = ''; // Remove the text content
  }
});

// Get the modified HTML content from the temporary div
const modifiedHtmlContent = tempDiv.innerHTML;

//console.log(modifiedHtmlContent);
return modifiedHtmlContent;




  }
/*
  document.getElementById('myButton').addEventListener('click', function() {
    //alert('Button clicked!');
    // Add your custom logic here
  });
*/
function exportFlux(editor) {

  setClicked(true);



  // Add a timeout to revert the button's state to the initial state after a brief delay (e.g., 1 second)
  setTimeout(() => {
    setClicked(false);
  }, 100); // 1000 milliseconds (1 second)



 //let flux =restoreXSLValueOfTags(editor.getContent({ format: 'raw' }));
 const newText1 = editor.getContent({ format: 'raw' });
   
  
    const dataRestored = restoreXSLValueOfTags(newText1);
 //console.log(dataRestored)

 
    const data = {
      dataRestored,
      newText2: 'Your newText2 value here', // Replace with your newText2 value
    };


 axios
 .post('https://localhost:4443/expFlux', data, {
   headers: {
     'Content-Type': 'application/json',
   },
 })
 .then((response) => {
   console.log('Response:', response.data);
 })
 .catch((error) => {
   console.error('Error:', error);
 });


 
   // alert("on its way")
  // const dataRestored = restoreXSLValueOfTags(newText1);
  }


    const tableStyle = {
      borderCollapse: 'collapse',
      width: '100%',
    };

    const thTdStyle = {
      border: '1px solid #dddddd',
      textAlign: 'left',
      padding: '8px',
    };

    const thStyle = {
      backgroundColor: '#f2f2f2',
    };
    const xslValue = {
            border: '1px solid #ccc', 
            padding: '2px', 
            display: 'inline-block'
        }

    const myButton = {
      backgroundColor: '#3498db', /* Change to your desired color */
      border: '2px solid #2980b9', /* Change to your desired border style */
      color: 'white',
      backgroundColor: clicked ? '#3498db' : 'initial',
      border: clicked ? '2px solid #2980b9' : 'initial',
      color: clicked ? 'white' : 'initial',
          display: 'inline-block',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          textDecoration: 'none',
          cursor: 'pointer',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#3498db',
          color: '#fff',
          transition: 'background-color 0.3s ease'
        }


        


   /*
        tinymce.PluginManager.add('myCustomPlugin', function(editor, url) {
          // Add logic for your button here
          editor.addButton('myButton', {
            text: 'My Button',
            icon: false, // Optionally, you can specify an icon
            onclick: function() {
              // Define the behavior when the button is clicked
              editor.insertContent('Hello, World!');
            }
          });
        });
*/
  return (
    <div>
        <div>
            
        <h1>DFF Variables</h1>
        <table style={tableStyle}>
        <thead>

        {publi.map((item, index) => (
            <tr key={index}>
               {index > 0 ? (
                     <td
                style={thTdStyle}
                className={clicked}
                onClick={() => handleCellClick(item[0])}
                ><div style={xslValue}>{item[0]}</div></td>     
                ) : null}
                
            </tr>
            ))}
 
        </thead>
        <tbody>
      
        </tbody>
        </table>
    </div>
            <div>
        <>
        <Editor
            apiKey="z07eirfy39vxe6ri4jmi94v8ffr01fbvwtznwzyp9uxnzr5w"
            onInit={(evt, editor) => {
            editorRef.current = editor;
            }}
            initialValue={htmlContent}
            init={{
            height: 500,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
                'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            valid_elements: '*[*]', // Allow all elements and attributes
            valid_children: '+body[style],+body[script]', // Allow script and style elements in body
            extended_valid_elements: 'svg[*],path[*]', // Allow SVG elements and paths
            content_style:
            `
            body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
            .xsl-value {
                border: 1px solid #ccc; /* Add a thin grey border */
                padding: 2px; /* Add some padding to separate the value from the border */
                display: inline-block; /* Display as inline-block to contain the value within the border */
            }
            `,
            auto_focus: false,
            }}
            onChange={() => makePostRequest(editorRef.current)}
        />
        
        </>
    </div>

    <button  value="export" 
    className={clicked ? 'my-button clicked' : 'my-button'} 
    onClick={() => exportFlux(editorRef.current)}

    
    id="myButton">export</button>
    </div>);
}
