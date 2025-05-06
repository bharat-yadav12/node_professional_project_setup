import 'dotenv/config'
import dbConnection from './db/dbConnection.js';
import { app } from './app.js';
// const app = express();
import { asyncHandler } from './utils/asyncHandler.js';
import userRoutes from './routes/user.route.js';
import bookRoutes from './routes/book.route.js';
import { authorRouter } from './routes/author.route.js';
import { productRouter } from './routes/product.route.js';

dbConnection()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
    app.on("error",(err)=>{
        console.log("error", err)
    })
})
.catch((err)=>{
    console.log("mongo db connection failed",err)
})

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRouter);
app.use('/api/products',productRouter);
// Error Handler
app.use((err, req, res, next) => {
    //console.log(err)
    res.status(err.statusCode || 500).json({...err, message: err.message, stack: err.stack, status: err.status});

  });

app.get("/",(req,res)=>{
    res.send("<h1>hello world</h1>")
})
const fetchRandomUser = async () => {
    console.log("now fetchRandomUser is called")
    const shouldFail = Math.random() < 0.5; // 50% chance of failure
    if (shouldFail) {
      throw new Error("Failed to fetch random user.");
    }
    return { id: 1, name: "Bharat the Backend Boss 💪" };
  };
  // async handleler fucntion 
//   const asyncHandler = (requestHandler) => {
//       return (req, res, next) => {
//           Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//       }
//   }
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
  // Route using asyncHandler
  app.get('/random-user', asyncHandler(async (req, res) => {
    const user = await fetchRandomUser(); // might throw error
    console.log("now request handler is called");
    res.status(200).json({
      success: true,
      user,
    });
  }));

function generateRandomNumber(req, res) {
    res.send(`Random number: ${Math.floor(Math.random() * 100) + 1}`);
    //return Math.floor(Math.random() * 100) + 1;
}
app.get('/random', generateRandomNumber);
// create get api to return json tye respose in which we are returning 5 user's dummy data
app.get('/api/users', (req, res) => {
    // console.log("req is ", req.body)
    // console.log("req is ", req.query)
    // console.log("req is ", req.params)
    // console.log("req is ", req.headers)
    // console.log("req is ", req.cookies)
    // console.log("req is ", req.method)
    // console.log("req is ", req.url)
    // console.log("req is ", req.ip)
    // console.log("req is ", req.hostname)
    // console.log("req is ", req.protocol)
    // console.log("req is ", req.path)
    // console.log("req is ", req.originalUrl)
    // console.log("req is ", req.baseUrl)
    // console.log("req is ", req.route)
    // console.log("res is ", res.body)
    // console.log("res is ", res.query)
    // console.log("res is ", res.params)
    // console.log("res is ", res.headers)
    const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Bob Smith' },
        { id: 4, name: 'Alice Johnson' },
        { id: 5, name: 'Charlie Brown' }
    ];
    res.json(users);
});
const asyncronoufun = async ()=>{
    console.log('hello async function');
    
}
asyncronoufun()
let val1 = 10;
let val2 = 20;
const myfun =  async (fn) => {
    val1 = 10;
    val2 = 20;
   return  async () => {
    console.log('async is called:');
    await fn(val1,val2);
   }

}
const fn = async (val1,val2) => {
    console.log('fun function body',val1 + val2)
}
const Asynhanlderfn = await myfun(fn)
Asynhanlderfn()



app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to fetch user data based on userId
    const user = { id: userId, name: 'John Doe' };
    res.json(user);
});
// write a get request which uses the all three req,res and next as well
app.get('/api/users/:id/:name', (req, res, next) => {
    const userId = req.params.id;
    const userName = req.params.name;
    // Logic to fetch user data based on userId
    const user = { id: userId, name: userName };
    res.json(user);
});
const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
  }
  
  app.use(myLogger)

app.get("/about", (req, res) => {
    res.send("<h1>hello world</h1>")
}
)
app.use(myLogger)