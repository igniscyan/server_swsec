const express = require('express'),
    router = express.Router(),
    User = require('./schema.js'),
    bcrypt = require('bcrypt'),
    authorize = require('../../auth/auth'),
    BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS),
    jwt= require('jsonwebtoken'),
    jwtKey = process.env.JWTKEY,
    jwtExpire = process.env.JWTEXPIRE;
    

/**
 * POST
 * Route: /users/register
 * TODO: debug and test
 *      implement a check for USERNAME ALREADY TAKEN
 *      implement logic for interpreting salted password in the request
 */
router.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let userLevel = req.body.level;
    let money = req.body.password;
    let data;
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then(hash => {
            let user = new User({
                username: username,
                password: hash,
                userLevel: 2,
                money: 0
            });
            user.save((err, result) => {
                if (err) {
                    res.status(500).json({
                        err: err
                    });
                }
                const token = jwt.sign({username},jwtKey,{
                    algorithm:'HS256',
                    expiresIn: jwtExpire * 1000
                })
                res.status(200).json({
                    data: result,
                    token: token
                }
                );
            })
            
        });
});

/**
 * POST
 * Route: /users/login
 * TODO: debug and test
 */
router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let data;
    User.find({username: username})
        .then(user => {
            data = user[0]
            return bcrypt.compare(password, user[0].password);
        })
        .then(passwordMatch => {
            if (!passwordMatch) {
                res.status(403).send();
            }
            const token = jwt.sign({username},jwtKey,{
                algorithm:'HS256',
                expiresIn: jwtExpire * 1000
            })
            res.status(200).json({
                data: data,
                token: token
            })
        })
        .catch(err => {
            console.log("Error authenticating user: ");
            console.log(err);
        })
});

router.get('/:username', (req, res) => {
    let username =  req.params.username;


    User.find({
        username: username
    }, (err, doc) => {
        if(err) {
            res.status(500).json({
                err: err
            });
        }
        res.status(200).json({
            response: doc
        });
    });
});

module.exports = router
