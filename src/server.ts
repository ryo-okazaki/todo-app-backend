import app from './main.js';
import config from './configs/config';

const PORT = config.get('EXPRESS_INTERNAL_SERVER_PORT') || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
