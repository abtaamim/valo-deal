const { handleUpload } = require('@vercel/blob/client');

const uploadMobilePhotosHandler = async (request, response) => {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Blob upload completed', blob, tokenPayload);
        try {
          // Add logic after file upload completion
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
};

module.exports = uploadMobilePhotosHandler;
