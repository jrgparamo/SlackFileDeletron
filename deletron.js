function getFiles(url) {
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
  }).then((response) => {
    // response object
    return resObj = JSON.parse(response);
  }, error => {
    console.error('Error when getting files', e.message);
  });
};

function deleteFiles(file_id, token) {
  return new Promise((resolve, reject) => {
    const lib = require('https');

    let request = lib.get('https://slack.com/api/files.delete?token='+token+'&file='+file_id, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Fail, status code: ' + response.statusCode));
      }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
  }).then(function(response) {
    // response object
    return resObj = JSON.parse(response);
  }, error => {
    console.error('Error when deleting files', e.message);
  });
};

async function main(token) {
  let filesOG = await getFiles('https://slack.com/api/files.list'+'?token='+token+'&count=1000').catch((err) => console.error(err));
  // Total number of files
  filesLen = filesOG.files.length
  // Files array
  files = filesOG.files;

  if(filesLen > 0) {
    for (let index = 0; index < filesLen; index++) {
      let element = files[index];
      let response = await deleteFiles(element.id, token).catch((err) => err);
      let count = index + 1;
      if(response.ok){
        console.log('\nFileID: ' + element.id +' - '+ count + ' of '+ filesLen +' was deleted '+ response.ok);
      } else {
        console.log('\nFileID: '+ element.id + ' - '+ count+ ' of '+ filesLen +' - was not deleted you are not the file owner' + '\nSlack API Error: '+ response.error + ' - Authenticated user does not have permission to delete this file.');
      }
    }
  }
}

if (process.argv[2]){
  const token = process.argv[2];
  console.log('Token used ' +process.argv[2])
  main(token);
} else {
  console.error('Please add user token as an argument');
}