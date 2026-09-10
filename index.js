const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const taskRouter = require('./routes/taskRoute');
const { superBaseConnect } = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middleWares/errorHandler');
const bodyParser = require('body-parser');

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }),
);

superBaseConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api', taskRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Task Management server is running at Port ${PORT}`);
});
