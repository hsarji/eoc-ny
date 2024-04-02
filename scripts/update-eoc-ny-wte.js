// Import the 'fs' and 'path' modules
const fs = require('fs');
const path = require('path');

// The path of the input and output files
// const inputFilePath = path.join(process.env.GITHUB_WORKSPACE, '_outline.md');
const inputFilePath = path.join(process.env.GITHUB_WORKSPACE, 'manuscript', '_eoc-ny-wte.md');

const outputFileName = 'eoc-ny-wte.txt';
const outputFilePath = path.join(process.env.GITHUB_WORKSPACE, 'temp', outputFileName);


// Read the contents of the input file
const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

// Define a regular expression to match the pattern [[something to remove|something to keep]] or [[something to keep]]
const regex = /\[\[(.+?)(?:\|(.+?))?\]\]/g;


// Replace the pattern with the second capture group if it exists, otherwise the first capture group, which is the part to keep
const removedWikiLinks = fileContent.replace(regex, (match, p1, p2) => p2 ? p2 : p1);


// Strip HTML comments but leave <!--members-only-->
// const strippedComments = removedWikiLinks.replace(/<!--[\s\S]*?-->/g, '');
var strippedComments = removedWikiLinks.replace(/<!--(?!members-only)[\s\S]*?-->/g, '');

// Strip 📝 emoji
// const strippedContent = strippedComments.replace(/📝/g, '');


// Split the content into an array of lines
// const lines = strippedContent.split('\n');

// Initialize a variable to hold the output content
// let outputContent = '';

// Iterate over each line
// lines.forEach(line => {
  // Check if the line starts with a '+' symbol
// if (line.trim().startsWith('+')) {
    // If it does, add the line to the output content
//     outputContent += line + '\n';
//   }
// });

// Split the content into an array of lines
const lines = strippedComments.split('\n');

// Initialize a variable to hold the output content
let outputContent = '';

// Iterate over each line
lines.forEach(line => {
  // Check if the line is a bullet line
  // let isBulletLine = /^\s*[-+*]/.test(line);
  let isBulletLine = /^\s*[-+*]\s/.test(line);
  // Check if the line starts with a '+' symbol
  let isPlusLine = line.trim().startsWith('+');
  // If it is a plus line or not a bullet line, add it to the output content
  if (isPlusLine || !isBulletLine) {
    outputContent += line + '\n';
  }
});



// Write the output content to the output file
fs.writeFileSync(outputFilePath, outputContent);

// Print a message to the console indicating that the code has finished running and the name of the output file that was generated
console.log(`Finished running the code! The output file is: ${outputFileName}`);



const GhostAdminAPI = require('@tryghost/admin-api');

// Configure the Ghost API
const api = new GhostAdminAPI({
    url: 'https://willstrustsestates.ghost.io',
    key: '64e255cb0012cd0001fa0697:9ccd11adf4c06da527ff624476af6aec5556d043f1abbf537c2ac7841dd10894',
//    key: '657e880a131187000172d037:7ce136f1ba666dd4c69e5f9d9608d3ffa13520a2abacbbf666418790d2f60a02',
    version: 'v5.0',
});

// Read the markdown file
const markdown = fs.readFileSync('temp/eoc-ny-wte.txt', 'utf8');


// Define the post ID
const postId = '652b1adaf583640001af0b5a';



// Get the current updated_at value for the post from the server
api.posts.read({id: postId})
.then((post) => {
    // Store the updated_at value in a variable
    const serverUpdatedAt = post.updated_at;

    // Update the post
    api.posts.edit({
        id: postId,
        updated_at: serverUpdatedAt,
       mobiledoc: null, // ensure we don't hit errors when updating if this was previously mobiledoc
        lexical: JSON.stringify({
            root: {
                children: [{type: 'markdown', version: 1, markdown: markdown}],
                direction: null,
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }
        })
    })
    .then((updatedPost) => {
        console.log(`Post updated: ${updatedPost.url}`);
    })
    .catch((err) => {
        console.error(err);
    });
})
.catch((err) => {
    console.error(err);
});





