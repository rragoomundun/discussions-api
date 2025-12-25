import fs from 'fs';
import nodemailer from 'nodemailer';
import mustache from 'mustache';

import User from '../models/User.js';
import Config from '../models/Config.js';

const transporterConfig = {
  host: process.env.TRANSPORTER_HOST,
  port: Number(process.env.TRANSPORTER_PORT),
  secure: process.env.TRANSPORTER_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
};

const transporter = nodemailer.createTransport(transporterConfig);

const send = async (options) => {
  const { mail, userId } = options;
  const user = await User.findOne({ where: { id: userId } });
  const config = await Config.findOne();
  const { name } = user;
  const to = user.email;

  const mailData = JSON.parse(fs.readFileSync(`mails/${config.lang}/definitions/${mail}.json`));
  const templateName = mailData.template;
  let haveReplyTo = options.haveReplyTo;
  let replyTo;
  let fromEmail = options.fromEmail;
  let templateOptions = options.templateOptions;

  if (!templateOptions) {
    templateOptions = {};
  }

  templateOptions.name = name;
  templateOptions.title = mustache.render(mailData.title, { forumName: config.title });
  templateOptions.forumTitle = config.title;
  templateOptions.year = new Date().getFullYear();

  if (haveReplyTo) {
    replyTo = process.env.REPLY_EMAIL;
  }

  if (!fromEmail) {
    fromEmail = process.env.FROM_EMAIL;
  }

  const template =
    fs.readFileSync(`mails/${config.lang}/views/header.html`, 'utf-8') +
    fs.readFileSync(`mails/${config.lang}/views/${templateName}.html`, 'utf-8') +
    fs.readFileSync(`mails/${config.lang}/views/footer.html`, 'utf-8');

  const message = {
    to,
    replyTo,
    from: `${process.env.FROM_NAME} <${fromEmail}>`,
    html: mustache.render(template, templateOptions),
    subject: templateOptions.title
  };

  await transporter.sendMail(message);
};

export default { send };
