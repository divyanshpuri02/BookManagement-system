const winston = require('winston');
// const config = require('config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    process.env.NODE_ENV === 'production'? winston.format.timestamp() : winston.format.timestamp(({format:"DD-MM-YYYY, hh:mm:ss"})) ,
    winston.format.splat(),
    // winston.format.align(),
    winston.format.json(),
    winston.format.printf(({ timestamp ,level, message }) => `${timestamp} - ${level}: ${message}`)
    
  ),
  transports: [
    new winston.transports.File({filename: 'app.log', level: 'info'}),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.Console({  
      stderrLevels: ['error'],
      prettyPrint: true,
    }),
  ],
});

module.exports = logger;

/*Short Way
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, printf, splat } = format;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.label} ${info.level}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    colorize(),
    label({ label: '[app-server]' }),
    timestamp(),
    splat(),
    myFormat
  ),
  transports: [new transports.Console()]
});

module.exports = logger;
*/ 