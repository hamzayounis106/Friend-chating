import { MailtrapClient } from 'mailtrap';

const token = process.env.MAIL_TRAP_TOKEN;

if (!token) {
  throw new Error('MAIL_TRAP_TOKEN and MAIL_TRAP_END_POINT must be defined');
}

export const mainClient = new MailtrapClient({
  token: token,
});

export const mailSender = {
  email: 'admin@creatic.pro',
  name: 'Muhammad Hamza',
};
