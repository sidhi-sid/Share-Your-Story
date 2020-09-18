const path=require('path')
const express=require ('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const morgan=require('morgan')
const exphbs=require('express-handlebars')
const session=require('express-session')
const connectDB=require('./config/db')
const passport=require('passport')
const MongoStore=require('connect-mongo')(session)

dotenv.config({path:'./config/config.env'})

require('./config/passport')(passport)

connectDB()

const app=express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

if(process.env.NODE_ENV==="development"){
    app.use(morgan('dev'))
}

const { formatDate , stripTags, truncate }=require('./helpers/hbs')

app.engine('.hbs', exphbs({helpers: {formatDate, stripTags, truncate }, defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
  }))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname,'public')))
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));
const PORT=process.env.PORT||3000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
