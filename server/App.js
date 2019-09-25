import express from 'express';
import logger from 'winston';
import path from 'path';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';

import {
  config
} from './config/global';

import {
  userController,
} from './controller';

import {
  connection
} from './database/mysql'

var app = express();

// Apply strategy to passport
// applyPassportStrategy(passport);

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Set up CORS
app.use(cors());

app.get('/', (req, res) => {
  connection.getConnection( (err, tempCon) => {
    if(err){
      // tempCon.release();
      console.log('Error: '+err);
    } else{
      console.log('Connected to db!');
  
      tempCon.query('SELECT * from GOT', (err, rows, fields) => {
        tempCon.release();
        if (err){
          console.log('Error while performing Query.'+err);
        } else {
          rows.forEach((row) => console.log(row.firstName));
          //console.log(rows);
          res.json(rows);
        }
      });
    }
  });
});

app.use('/users', userController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Get port from environment and store in Express.
 */
const {
  port
} = config.env;

app.listen(port, () => {
  logger.info(`Started successfully server at port ${port}`);
  // Connect MySQL
});