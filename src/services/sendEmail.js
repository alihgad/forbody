import Dotenv  from "dotenv";
import { createTransport } from "nodemailer";
Dotenv.config()

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.GmailEmail,
    pass: process.env.GmailPassword,
  },
});

async function main(email,html,subject,attachments=[]) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"For Body"', // sender address
    to: email, // list of receivers
    subject , // Subject line
    html, // html body,
    attachments

  });

}


export default main
