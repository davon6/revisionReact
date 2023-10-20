import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function App() {
  const editorRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');

  useEffect(() => {
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
      })
      .catch((error) => {
        console.error('Error fetching HTML content:', error);
      });
  }, []);

  const makePostRequest = (editor) => {
    // Get the content of the TinyMCE editor
   const newText1 = editor.getContent({ format: 'raw' });

   

    const dataRestored = restoreXSLValueOfTags(newText1);

   // console.log(dataRestored + typeof dataRestored)

    // You can also get newText2 from the state if needed

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

        console.log(match);

        content = content.replace(
          match,
          match.substring(0, match.length - 1) + ` contenteditable="false" class="xsl-value">${value}`)

      });
    }
  
    return content;
  }
  

  // Function to restore original <xsl:value-of> tags from formatted placeholders
  function restoreXSLValueOfTags(content) {
/*
    const stringsToUse = [];
    // Split the input string by <xsl:value-of> tags
    const segments = content.split('<xsl:value-of');
    
    // Iterate through the segments and extract content
    for (const segment of segments) {
      const endIndex = segment.indexOf('contenteditable');
      if (endIndex !== -1) {
         stringsToUse.push(segment.substring(0, endIndex).trim());
       
      }
    }
    console.log(stringsToUse);
*/
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

// console.log(content);


  }

  return (
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
  );
}



/*

<button onClick={() => {
        // Restore original <xsl:value-of> tags before sending for editing
        const restoredContent = restoreXSLValueOfTags(editorRef.current.getContent({ format: 'raw' }));
        setHtmlContent(restoredContent);
      }}>Restore Original Content</button>

*/