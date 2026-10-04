const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket('shareaddaa-616e5.firebasestorage.app');

async function setCors() {
  await bucket.setCorsConfiguration([
    {
      origin: ['*'],
      method: ['GET'],
      responseHeader: ['Content-Type'],
      maxAgeSeconds: 3600,
    },
  ]);
  console.log('CORS configured successfully on shareaddaa-616e5.firebasestorage.app');
}

setCors().catch(console.error);
