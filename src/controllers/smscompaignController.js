const accountSid = 'AC4017ea8c0cd291a18db4f12752c84d94';
const authToken = '8bf87077c89b81461f86c88fc168842e';
const client = require('twilio')(accountSid, authToken);

const sendSMS = async (req, res) => {
  try {
    const { to, body } = req.body;

    const message = await client.messages.create({
      body: body,                  // Message text
      to: to,                      // Recipient number (must be verified if trial account)
      from: '+19785816861'         // ✅ Your Twilio number
    });

    console.log('Message SID:', message.sid);
    res.status(200).json({ success: true, sid: message.sid });
  } catch (err) {
    console.error('Twilio Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  sendSMS
};
