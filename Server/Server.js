const express = require('express');
const app = express();
const db = require('./config/connect')
const userRoute = require('./routes/user')
const bodyParser = require("body-parser");
const cors=require('cors');
const dotenv = require("dotenv");
const linkRoute=require('./routes/createLink')
dotenv.config();


app.use(cors());


app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use('/api/user',userRoute);
app.use('/api/link',linkRoute);
app.use("/", linkRoute);




const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Welcome to the Link Management Plateform Server')
})

db().then(() => {
    console.log("Conected to the database");
}).catch((err) => {
    console.log("Error in connection");
});


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
    });