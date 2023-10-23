import dotenv from "dotenv";
import User from "./models.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import getPassword  from "../../config/pwgeneration.js";
import getIncrementId from "../../config/AutoIncrement.js";
import { USER_COL } from "../../constants/collections.js";
import { LOGGED_OUT, DOC_NOT_FOUND, UNKNOWN_ERROR, MISSING_REQUIRED_FIELD, LOCKED_USER, SUCCESS, INCORRECT_CREDENTIALS, NOT_MATCHED_PASSWORD} from "../../constants/messages.js";
import { userLogger } from "../../config/logger.js";
import Blacklist from "./blacklist.js";


dotenv.config();
const saltRounds = 10;

export async function login(req, res) {
    const { username, password } = req.body;
    User.findOne({ username })
    .then(existingUser => {
        bcrypt.compare(password, existingUser.password, (err, result) => {
            if(err) {
                userLogger.error(`Error occurs when logging in with user ${username}`);
                return res.status(500).json({
                    message: UNKNOWN_ERROR,
                    error: err
                });
            };
            if(result === false) {
                userLogger.warn(`Failed attempt login with user ${username}`);
                return res.status(401).json({
                    message: INCORRECT_CREDENTIALS
                });
            }
            if(existingUser.active === true) {
                const token = existingUser.generateAccessJWT();
                let options = {
                    maxAge: 20 * 60 * 1000, // would expire in 20minutes
                    httpOnly: true, // The cookie is only accessible by the web server
                    secure: true,
                    sameSite: 'None',
                  };
                userLogger.info(`${username} logged in successfully`);
                res.cookie("SessionID", token, options);
                return res.status(200).json({
                    message: "Welcome",
                    username: existingUser.username,
                    role: existingUser.role,
                    firstLogin: existingUser.firstLogin,
                    token: token
                });
            } else {
                userLogger.warn(LOCKED_USER);
                return res.status(400).json({
                    message: LOCKED_USER
                });
            };
        });
    }).catch( err => {
        console.log(err);
    });
};

export async function logout( req, res ) {
    try{
        const authHeader = req.headers["cookie"]; // get the session cookie from request header
        if(!authHeader) return res.sendStatus(204);
        const cookie = authHeader.split("=")[1];
        const accessToken = cookie.split(";")[0];
        const checkIfBlackListed = await Blacklist.findOne({ token: accessToken});
        if(checkIfBlackListed)  return res.sendStatus(204);
        const newBlackList = new Blacklist({
            token: accessToken,
        });
        await newBlackList.save();
        
        // Also clear request cookie on client
        res.setHeader("Clear-Site-Data", '"cookies", "storage"');
        res.status(200).json({ message: LOGGED_OUT });
    } catch (err) {
        res.status(500).json({
            message: UNKNOWN_ERROR,
            err
        });
    };
    res.send();
};

export async function createNewUser(req, res) {
    const {username, password, fullName, role} = req.body
    const newId = await getIncrementId(USER_COL);
    bcrypt.hash(password, saltRounds, (err, hash) => {
        const password = hash;
        const user = new User({
            _id: newId,
            username: username,
            password: password,
            fullName: fullName,
            active: true,
            role: role
        });
        // check that user submits the required value
        if(!user.username || !user.fullName || !user.role || !user.password) {
            userLogger.warn(MISSING_REQUIRED_FIELD);
            return res.status(400).json({
                message: MISSING_REQUIRED_FIELD,
                data: user
            });
        }
        // verify the user isn't stored in the database
        User.count({
            username: user.username
        })
        .then(count => {
            if(count > 0) {
                return res.status(400).json({
                    message: "Tên đăng nhập đã tồn tại"
                });
            };
            user.save()
            .then(newUser => {
                userLogger.info(`Created new user successfully: ${newUser.username}`);
                return res.status(201).json({
                    message: SUCCESS,
                    data: newUser,
                });
            }).catch (err => {
                userLogger.error(err);
                res.status(500).json({
                    message: UNKNOWN_ERROR,
                    error: err
                })
            });
        });
    });
};

export function getOneUser(req, res) {
    const userId = req.params.userId;
    User.findById({_id: userId}, {password: 0, __v: 0})
    .then(result => {
        return res.status(200).send(result);
    }).catch (err => {
        return res.status(500).json({
            message: DOC_NOT_FOUND,
        });
    });
};

export function getAllUsers(req, res) {
    User.find({}, {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        firstLogin: 0,
        __v: 0,
    })
    .then(result => {
        return res.status(200).send(result);
    }).catch(err => {
        return res.status(400).json({
            message: UNKNOWN_ERROR,
            err: err
        });
    });
};

export function changePassword( req, res ) {
    const newPassword = req.body.newPassword;
    const confirmedPassword = req.body.confirmedPassword;
    if (newPassword !== confirmedPassword) {
        return res.status(400).json({
            message: NOT_MATCHED_PASSWORD
        });
    };
    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        if(err) {
            return res.status(500).json({
                message: UNKNOWN_ERROR
            });
        };
        User.findOneAndUpdate({_id: req.body.userId}, {$set: {password: hash, firstLogin: false}})
        .then( result => {
            return res.status(200).json({
                message: SUCCESS
            })
        }).catch( error => {
            return res.status(500).json({
                message: UNKNOWN_ERROR,
                error: error
            });
        });
    });
};

export function resetPassword(req, res) {
    //generate a random password
    const password = getPassword();
    bcrypt.hash(password, saltRounds, (err, hash) => {
        User.updateOne({_id: req.params.userId}, {$set: {password: hash, firstLogin: true}})
        .then(() => {
            User.findById({_id: req.params.userId}, {password: 0, __v: 0})
            .then((user) => {
                return res.status(200).json({
                    title: "Reset mật khẩu thành công",
                    body: "Mật khẩu mới của " + user.username + " là: " + password,
                })
            })
        }).catch(err => {
            return res.status(400).json({
                message: UNKNOWN_ERROR,
                error: err
            });
        });
    });
};

export function editUser( req, res ) {
    const {_id, username, password, fullName, role} = req.body;
    if(password) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err) {
                return res.status(500).json({
                    message: UNKNOWN_ERROR
                });
            };
            User.findOneAndUpdate({_id: _id}, {$set: {password: hash, fullName: fullName, role: role}})
            .then( result => {
                userLogger.info(`Edited user successfully: ${username}`);
                return res.status(200).json({
                    message: SUCCESS
                })
            }).catch( error => {
                return res.status(500).json({
                    message: UNKNOWN_ERROR,
                    error: error
                });
            });
        });
    } else {
        User.findOneAndUpdate({_id: _id}, {$set: {fullName: fullName, role: role}})
        .then( result => {
            userLogger.info(`Edited user successfully: ${username}`);
            return res.status(200).json({
                message: SUCCESS
            })
        }).catch( error => {
            return res.status(500).json({
                message: UNKNOWN_ERROR,
                error: error
            });
        });
    }
};

export function toggleActive( req, res ) {
    const {_id, active} = req.body;
    User.findOneAndUpdate({_id: _id}, {$set: {active: !active}})
    .then( result => {
        return res.status(200).json({
            message: SUCCESS
        })
    }).catch( error => {
        return res.status(500).json({
            message: UNKNOWN_ERROR,
            error: error
        });
    });
};