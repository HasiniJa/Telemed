const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./src/app");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Patient Service DB connected");
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () =>
      console.log(`Patient Service running on port ${PORT}`)
    );
  })
  .catch(err => console.error(err));
