export const MESSAGES = {
  ERROR_MESSAGE: 'An error occurred, please try again.',
  MODE_OF_DEVELOPMENT: 'Application running state: ',
  DENIED_REQUEST: 'Invalid request',
  DECRYPTION_FAILED: 'Provided data is invalid',
  DID_FAILED: 'DID creation failed',
  TRANSACTION_COMPLETED: 'Transaction completed',
  ENV_ERROR: 'Not able to access data from .env',
};

// export const ENCRYPTION_SECRET = {
//   URL: '12345678901234567890123456789012',
//   DATA: '12345678901535353550443456789012',
// }; // for aes-256-cbc



export const ENCRYPTION_SECRET = {

  URL: 'TxmtDd1OsvdPfoP85zyhszNCl4vW8KxZeV1Jt2G9vzk=', 
  DATA: 'goMq0TvzUP3vOO2v02UJfHCdaTAOOLCAWXRAQ3Zxpuc=', 
};
// export const IV_LENGTH: number = 16; // for - aes-256-cbc

export const IV_LENGTH = 12;

export const ENCRPYTION_ALGORITHM = {
  // AES_256: 'aes-256-cbc',
  AES_256: 'aes-256-gcm',

};

export const ENCRYPTED_ENDPOINTS = {
  TRANSHEX: '/transactionHex',
};
