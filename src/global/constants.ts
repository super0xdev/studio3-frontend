export const MAINNET_CHAIN_ID = 101;

export const TOKEN_LIST = [
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ', // DUST
];

export const WHITE_LIST = [
  '53VqXqwTEK5MNJPqxu3yEUBHpo78vMoHt1vZpjVThnps',
  '6Dio27qRnsTFaFUwAshonT82FS1d3C9uA9WvyyQXyuro',
  'C8VSZEcAUXNKTEvtfRztREXt1fT5Rf3tAvNaumvuc8Li',
  '6zBaDY9LG2DMotrjdfJfJ6w8aLA7YqSV4jm6V7JWgabC',
];

//export const APP_API_URL = 'http://127.0.0.1:8081';
export const APP_API_URL = 'https://api.studio-3.xyz';

export const APP_ASSET_URL =
  'https://d3-studio-assets.s3.us-east-2.amazonaws.com/';

// TODO: this is likely not the best way to check if a design is a template - this UID may change
export const TEMPLATE_USER_ID = 5574987670839803000;

export const CONFIRM_MODAL_INFO = {
  DELETE: {
    title: 'Design Deletion Confirmation',
    content:
      'Are you sure you want to delete this design? This action cannot be undone.',
    submit: 'Delete',
  },
  DUPLICATE: {
    title: 'Design Duplication Confirmation',
    content:
      'Are you sure you want to duplicate this design? This will create a new file in your library with the exact same design.',
    submit: 'Duplicate',
  },
  DOWNLOAD: {
    title: 'Select Download Type',
    content: 'Please select method to download this image',
    submit: 'OK',
  },
};
