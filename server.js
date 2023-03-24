const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');

// Set up your Telegram bot and channel
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const channelName = '@ljtest2023';

// Set up your email details
const fromAddress = process.env.FROM_ADDRESS;
const fromPassword = process.env.FROM_PASSWORD;
const toAddress = process.env.TO_ADDRESS;

const sendEmail = async (subject, message) => {
  // Set up the transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromAddress,
      pass: fromPassword
    }
  });

  // Set up the email options
  const emailOptions = {
    from: fromAddress,
    to: toAddress,
    subject: subject,
    text: message
  };

  // Send the email
  await transporter.sendMail(emailOptions);
};

// Set up an empty array to store the IDs of the messages we've already sent
let sentMessages = [];

// Check for new messages every 60 seconds
setInterval(async () => {
  try {
    // Get the latest messages from the Telegram channel
    const messages = await bot.getChatHistory(channelName, { limit: 10 });

    // Check each message to see if we've already sent it
    for (const message of messages) {
      if (!sentMessages.includes(message.message_id)) {
        // If this is a new message, send it via email and add its ID to the list of sent messages
        await sendEmail('New post in your Telegram channel!', message.text);
        sentMessages.push(message.message_id);
      }
    }
  } catch (error) {
    console.error(error);
  }
}, 120000); //2min
