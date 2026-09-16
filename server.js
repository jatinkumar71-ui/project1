require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/db");

connectToDB();

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`server is running on the address http://localhost${PORT}`);
});
