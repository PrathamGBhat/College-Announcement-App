import { User } from '../model/User.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';

// Handle serializing and deserializing user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({

    clientID : env.GOOGLE_CLIENT_ID,
    clientSecret : env.GOOGLE_CLIENT_SECRET,
    callbackURL : env.GOOGLE_CALLBACK_URL

}, async (accessToken, refreshToken, profile, done) => {

    try {

        // Check for existing user and refresh or create new user in db
        let user = await User.findOne({googleId : profile.id});

        if (!user){
            user = await User.create({
                googleId : profile.id,
                email : profile.emails[0].value,
                name : profile.displayName,
                accessToken : accessToken,
                refreshToken : refreshToken
            })
        } else {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
        }

        return done(null,user);

    } catch (err) {

        return done(err);

    }
}));

export { passport };