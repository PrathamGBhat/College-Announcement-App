import { oauth2Client } from '../config/oauth.js';

export async function handleOAuthCallback(req, res) {

  try {

    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('CLIENT TOKENS SUCCESSFULLY SET');

    res.redirect('/');

  } catch (err) {
    
    console.log(err.message);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    });
    
  }
}
