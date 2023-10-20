import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function App() {
  const editorRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [data, setData] = useState([]);

useEffect(() => {
    axios.get('https://localhost:4443/api/allUsers') // Replace with the actual URL of your API
      .then((response) => {
        setData(response.data); // Update the data state
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
/*

      document.addEventListener('click', handleCellClick);

      return () => {
        // Remove the click event listener when the component unmounts
        document.removeEventListener('click', handleCellClick);
      };*/
  }, []);

/*
  const handleCellClick = (event) => {
    // Check if the clicked element has the 'name-cell' class
    if (event.target.classList.contains('name-cell')) {
      // Get the content of the clicked cell
      const cellContent = event.target.textContent;

      // Insert the content into the TinyMCE editor at the cursor position
      const editor = editorRef.current;
      if (editor) {
        editor.execCommand('mceInsertContent', false, cellContent);
      }
    }
  };
*/

 /*
const handleCellClick = (value) => {
    const editor = editorRef.current;
    if (editor) {
      const selection = editor.selection.getContent(); // Get the current selection
      const cursorPosition = editor.selection.getRng(); // Get the cursor position
  
      // Insert a placeholder character at the cursor position
      const placeholderChar = '⚫'; // You can use any character you prefer
      editor.selection.setContent(value);
  
      // Find the placeholder character in the editor content
      const content = editor.getContent();
      const cursorIndex = content.indexOf(placeholderChar);
  
      if (cursorIndex !== -1) {
        // Move the cursor to the position after the placeholder character
        cursorPosition.setStart(editor.getBody(), cursorIndex);
        cursorPosition.setEnd(editor.getBody(), cursorIndex + 1);
        editor.selection.setRng(cursorPosition);
  
        // Replace the placeholder character with the original content
        editor.selection.setContent(''); // Clear the placeholder character
        editor.execCommand('mceInsertContent', false, value); // Insert the original content
      }
    }
  };
   */
  const handleCellClick = (value) => {
    const editor = editorRef.current;
    if (editor) {
      try {// custom-value-of'contenteditable="false" class="xsl-value"


        const editedValue =`<custom-value-of dffui:value="${value}" select="client/entreprise/adresse/ville"` +
        `contenteditable="false" class="xsl-value">${value}</custom-value-of>`




        editor.insertContent(editedValue);
      } catch (error) {
        // Handle the error gracefully, e.g., log the error or display an error message.
        console.error('Error inserting content:', error);
      }
    }
  };
  

  
  /*
  const handleCellClick = (value) => {
    // Insert the value into the editor at the cursor position

  const editor = editorRef.current; 



    if (editor) {

      editor.execCommand('mceInsertContent', false, value);
    }
  };*/

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
   

  return (
    <div>
        
        <div>
            
        <h1>Data from "usersComp" table</h1>
        <table style={tableStyle}>
        <thead>
            <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Address</th>
            <th style={thTdStyle}>City</th>
            <th style={thTdStyle}>Age</th>
            <th style={thTdStyle}>Sex</th>
            </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
            <tr key={index}>
                <td>{item[0]}</td>        {/* ID */}
                <td
                style={thTdStyle}
                className="clickable-cell"
                onClick={() => handleCellClick(item[1])}
                ><div style={xslValue}>{item[1]}</div></td>        {/* Name */}
                <td>{item[2]}</td>        {/* Address */}
                <td>{item[3]}</td>        {/* City */}
                <td>{item[4]}</td>        {/* Age */}
                <td>{item[5]}</td>        {/* Sex */}
            </tr>
            ))}
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
    </div>);
}
