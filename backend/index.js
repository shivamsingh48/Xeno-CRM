import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
// import './consumers/customerConsumer.js';
// import './consumers/orderConsumer.js';

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server started at port - ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1); 
  });

