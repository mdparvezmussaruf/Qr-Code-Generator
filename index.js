import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

inquirer
  .prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter the URL to generate a QR code:',
      validate: (input) => input.trim() ? true : 'URL cannot be empty!',
    }
  ])
  .then((answers) => {
    const { url } = answers;

    // Generate QR Code
    const qr_svg = qr.image(url, { type: 'png' });
    const qrStream = fs.createWriteStream('qrcode.png');

    qr_svg.pipe(qrStream);

    qrStream.on('finish', () => {
      console.log('QR code generated successfully: qrcode.png');
    });

    qrStream.on('error', (err) => {
      console.error('Error writing QR code file:', err);
    });

    // Save the URL to a text file
    fs.writeFile('url.txt', url, (err) => {
      if (err) {
        console.error('Error saving URL to file:', err);
      } else {
        console.log('The URL has been saved successfully: url.txt');
      }
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.error('Prompt could not be rendered in the current environment.');
    } else {
      console.error('An unexpected error occurred:', error);
    }
  });
