const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const client_id = process.env.REDDIT_CLIENT_ID;
const client_secret = process.env.REDDIT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

app.get('/login', (req, res) => {
  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${client_id}&response_type=code&state=random&redirect_uri=${redirect_uri}&duration=permanent&scope=identity history edit read`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  const creds = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const tokenResponse = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri
    }),
    { headers: { Authorization: `Basic ${creds}` } }
  );

  const access_token = tokenResponse.data.access_token;

  res.redirect(`/dashboard.html#token=${access_token}`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
