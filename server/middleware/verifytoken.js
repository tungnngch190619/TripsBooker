import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../apps/users/models.js";
import Blacklist from "../apps/users/blacklist.js"
dotenv.config();
export default async function authenticate(req, res, next) {
  const authHeader = req.headers['cookie'];// get the session cookie from request header
  if(!authHeader) return res.status(401).json({ message: 'This session has expired. Please re-login'});
  // if there is no cookie from request header, send an unauthorized response.
  const cookie = authHeader.split('=')[1];// If there is, split the cookie string to get the actual jwt token
  const checkIfBlacklisted = await Blacklist.findOne({ token: cookie }); // Check if that token is blacklisted
    // if true, send an unathorized message, asking for a re-authentication.
  if(checkIfBlacklisted) 
    return res
    .status(401)
    .json({ message: 'This session is blacklisted. Please re-login' })

  // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
  // that's like checking the integrity of the cookie
  jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: 'Authorization failed',
        error: err
      });
    }
    const { id } = decoded; // get user id from the decoded token
    const user = await User.findById(id); // find user by that `id`
    const { password, ...data } = user._doc; // return user object but the password
    req.user = data; // put the data object into req.user
    next();
  });
};