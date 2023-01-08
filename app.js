const express = require('express')
const app = express()
app.use(express.static('./public'))
app.set('view engine', 'ejs')
app.set('views', './src/views')
let bookData = require('./src/model/bookData')
let authorData = require('./src/model/authorData')
app.use(express.urlencoded({ extended: true }))
let multer = require('multer')
let bcrypt = require('bcryptjs');
const loginData = require('./src/model/loginData')
const registerData = require('./src/model/registerData')
const { render } = require('ejs')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(req);
        callback(null, './public/images/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
        console.log(file.originalname);
    }
});


const upload = multer({ storage: storage })

const nav = [
    {
        name: "Home",
        link: "/"
    },
    {
        name: "Books",
        link: "/viewBook"
    },
    {
        name: "Author",
        link: "/viewAuthor"
    },
    {
        name: "Add Book",
        link: "/addBook"
    },
    {
        name: "Add Author",
        link: "/addAuthor"
    },
    {
        name: "Register",
        link: "/register"
    },
    {
        name: "Login",
        link: "/login"
    },
]

app.get('/', function (req, res) {
    res.render('index', { nav })
})
app.get('/viewbook', function (req, res) {
    bookData.find().then((books) => {
        res.render('books', { nav, books })
    }).catch((err) => {
        console.log(err);
    })

})
app.get('/viewAuthor', function (req, res) {
    authorData.find().then((authors) => {
        res.render('author', { nav, authors })
    }).catch((err) => {
        console.log(err);
    })
})
app.get('/addBook', function (req, res) {
    res.render('addBook', { nav, title: "" })
})
app.get('/addAuthor', function (req, res) {
    res.render('addAuthor', { nav, title: "" })
})
app.get('/register', function (req, res) {
    res.render('register', { nav })
})
app.get('/login', function (req, res) {
    res.render('login', { nav })
})
app.post('/saveBook', upload.single('addBookImg'), function (req, res) {

    const item = {
        bookName: req.body.name,
        author: req.body.author,
        description: req.body.description,
        image: req.file.filename
    }
    let book = bookData(item)
    book.save().then(() => {
        res.render('addBook', { nav, title: "Book added successfully" })
    }).catch((err) => {
        return res.status(400).json({
            success: false,
            error: true,
            message: err.message
        })
    })
})


app.post('/saveAuthor', upload.single('addAuthorImg'), function (req, res) {
    const authorItem = {
        authorName: req.body.name,
        contact: req.body.contact,
        image: req.file.filename
    }
    let author = authorData(authorItem)
    author.save().then(() => {
        res.render('addAuthor', { nav, title: "Author added successfully" })
    }).catch((err) => {
        return res.status(400).json({
            success: false,
            error: true,
            message: err.message
        })
    })

})

app.get('/book/:bookDel', function (req, res) {

    let id = req.params.bookDel
    console.log("id=" + id);
    bookData.findByIdAndDelete({ _id: id }).then(() => {
        res.redirect('/viewBook')
    }).catch((err) => {
        return res.status(400).json({
            message: err.message
        })
    })
})
app.get('/author/:authorDel', function (req, res) {

    let id = req.params.authorDel
    console.log("id=" + id);
    authorData.findByIdAndDelete({ _id: id }).then(() => {
        res.redirect('/viewAuthor')
    }).catch((err) => {
        return res.status(400).json({
            message: err.message
        })
    })
})

app.post('/registration', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        // console.log(req.body) //to see body values
        if (err) {
            res.status(400).json({
                message: err.message
            })
        } else {
            const loginDetails = {
                username: req.body.userName,
                email: req.body.email,
                password: hash
            }
            loginData.findOne({ username: req.body.userName }).then((result) => {
                console.log("result="+result.username);
                if (result.username) {
                    return res.status(400).json({
                        message: "username alredy exist"
                    })
                } else {
                    let login = loginData(loginDetails)
                    login.save().then((details) => {
                        console.log("details=" + details) //to get saved values in login model
                        const registerDetails = {
                            loginId: details._id,
                            fullName: req.body.name,
                            email: req.body.email
                        }
                        console.log(registerDetails);
                        const register = registerData(registerDetails)
                        register.save().then(() => {
                            res.render('login', { nav })
                        }).catch((err) => {
                            return res.status(400).json({
                                message: err.message
                            })
                        })
                    }).catch((err) => {
                        return res.status(400).json({
                            message: err.message
                        })
                    })
                }
            })



        }


    });


})
app.post('/loginSubmit', function (req, res) {
    let user
    loginData.findOne({ userName: req.body.username }).then((result) => {
        if (!result) {
            return res.json({
                message: "user not found"
            })

        }
        user = result
        return bcrypt.compare(req.body.password, user.password)

    }).then((value) => {
        if (value == true) {

            res.render('', {
                nav,
                message: "login successfull",
                success: true,
                error: false,
                loginId: user._id,
                username: user.username
            })

        } else {
            return res.json({
                message: "password error",
                success: false,
                error: true
            })
        }
    })

})
app.get('/userData', (req, res) => {
    loginData.aggregate([
        {
            '$lookup': {
                'from': 'registerdatas',
                'localField': '_id',
                'foreignField': 'loginId',
                'as': 'register'
            }
        },

        {
            '$unwind': '$register'

        },
        {
            '$group': {
                '_id': '$_id',
                'fullName': { '$first': '$register.fullName' },
                'email': { '$first': '$register.email' },
                'username': { '$first': '$username' },
            }
        }
    ]).then((data) => {
        res.status(200).json({
            details: data
        })
    })
})

app.listen(3001, () => {
    console.log("http://localhost:3001");
})