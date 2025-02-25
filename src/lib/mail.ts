// // import nodemailer from 'nodemailer';

// // const transporter = nodemailer.createTransport({
// //   host: process.env.MAILTRAP_HOST,
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.MAILTRAP_USER,
// //     pass: process.env.MAILTRAP_PASS,
// //   },
// // });

// // export default transporter;

// import nodemailer from "nodemailer";
// console.log("MAILTRAP_USER", process.env.MAILTRAP_USER);
// console.log("MAILTRAP_PASS", process.env.MAILTRAP_PASS);
// console.log("MAILTRAP_HOST", process.env.MAILTRAP_HOST);

// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: process.env.MAILTRAP_USER, // Your Mailtrap username
//     pass: process.env.MAILTRAP_PASS, // Your Mailtrap password
//   },
// });

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

// export default transporter;

import { MailtrapClient } from "mailtrap";

const token = process.env.MAIL_TRAP_TOKEN;
const endPoint = process.env.MAIL_TRAP_END_POINT;
console.log("token", token);
console.log("endPoint", endPoint);
export const mainClient = new MailtrapClient({
  endpoint: endPoint,
  token: token,
});
console.log("mainClient", mainClient);
export const mailSender = {
  email: "admin@creatic.pro",
  name: "Muhammad Hamza",
};
