export const logger = {
  log: (...messages) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...messages);
    }
  },
  error: (...messages) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...messages);
    }
  },
};