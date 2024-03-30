import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes.js';
import blogRouter from './routes/blog-routes.js';

const app = express();

app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

const port = 4000
mongoose.connect('mongodb+srv://martinfresh8:Qwertyuiop123@cluster1.0xlye5x.mongodb.net/Blog').then(() => {
    app.listen(port, () => {
        console.log(`Connected to the server and listening on port ${port}`)
    })
}).catch((err) => {
    console.log(`error: ${err}`)
})




export default app;