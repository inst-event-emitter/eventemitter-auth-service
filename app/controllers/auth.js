const speakeasy = require('speakeasy');
const { toDataURL } = require('qrcode');

// TODO: move this use to db
const user = {
  firstName: 'Jon',
  lastName: 'Doe',
  email: 'jon.doe@gmail.com',
  password: 'test'
};

const setup2Auth = async (req, res, next) => {
  try {
    const secret = speakeasy.generateSecret({ length: 10 });
    const dataUrl = await toDataURL(secret.otpauth_url);

    // TODO: save to logged in user.
    user.twofactor = {
      secret: '',
      tempSecret: secret.base32,
      dataUrl,
      otpURL: secret.otpauth_url
    };

    res.json({
      message: 'Verify OTP',
      tempSecret: secret.base32,
      dataUrl,
      otpURL: secret.otpauth_url
    });
  } catch (err) {
    next(err);
  }
};

// get 2fa details
const get2Auth = (req, res) => {
  res.json(user.twofactor);
};

// disable 2fa
const remove2Auth = (req, res) => {
  delete user.twofactor;

  res.send('Successfully remove user 2Auth');
};

const verifyAuth = (req, res) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: user.twofactor.tempSecret, // TODO: Receive secret from user
    encoding: 'base32',
    token
  });

  if (verified) {
    user.twofactor.secret = user.twofactor.tempSecret; // set secret, confirm 2fa
    return res.send('Two-factor auth enabled');
  }

  return res.status(400).send('Invalid token, verification failed');
};

const login = (req, res) => {
  if (!user.twofactor || !user.twofactor.secret) { // two factor is not enabled by the user
    // check credentials
    if (req.body.email === user.email && req.body.password === user.password) {
      return res.send('Successfully authenticated without OTP'); // authenticate user
    }
    return res.status(400).send('Invald email or password');
  }
  // two factor enabled
  if (req.body.email !== user.email || req.body.password !== user.password) {
    return res.status(400).send('Invald email or password');
  }

  // check if otp is passed, if not then ask for OTP
  if (!req.headers['x-otp']) {
    return res.status(206).send('Please enter otp to continue');
  }

  // validate otp
  const verified = speakeasy.totp.verify({
    secret: user.twofactor.secret,
    encoding: 'base32',
    token: req.headers['x-otp']
  });

  return verified
    ? res.send('Successfully authenticated with OTP')
    : res.status(400).send('Invalid OTP');
};

module.exports = {
  setup2Auth,
  get2Auth,
  remove2Auth,
  verifyAuth,
  login
};
