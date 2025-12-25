import fs from 'fs';
import nodemailer from 'nodemailer';
import mustache from 'mustache';

import User from '../models/User.js';
import Config from '../models/Config.js';

const transporterConfig = {
  host: 'email-smtp.eu-west-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
};

if (process.env.ENV === 'prod') {
  transporterConfig.secure = true;
}

const transporter = nodemailer.createTransport(transporterConfig);

const send = async (options) => {
  const { mail, userId } = options;
  const user = await User.findOne({ where: { id: userId } });
  const config = await Config.findOne();
  const { name } = user;
  const to = user.email;

  const mailData = JSON.parse(fs.readFileSync(`mails/${config.lang}/definitions/${mail}.json`));
  const templateName = mailData.template;
  let templateOptions = options.templateOptions;

  if (!templateOptions) {
    templateOptions = {};
  }

  templateOptions.name = name;
  templateOptions.title = mustache.render(mailData.title, { forumName: config.title });
  templateOptions.forumTitle = config.title;
  templateOptions.year = new Date().getFullYear();

  const template =
    fs.readFileSync(`mails/${config.lang}/views/header.html`, 'utf-8') +
    fs.readFileSync(`mails/${config.lang}/views/${templateName}.html`, 'utf-8') +
    fs.readFileSync(`mails/${config.lang}/views/footer.html`, 'utf-8');

  const message = {
    to,
    replyTo: process.env.REPLY_EMAIL,
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    html: mustache.render(template, templateOptions),
    subject: templateOptions.title
  };

  await transporter.sendMail(message);
};

export default { send };
