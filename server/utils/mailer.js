const nodeMailer = require("nodemailer");
const path = require('path');
const handlebars = require('nodemailer-express-handlebars');
const hb = require('handlebars');

hb.registerHelper('toCurrency', function(number) {
    if (!number) return "Không có";
    return number.toLocaleString() + "đ";
});

const sendMail = (to, subject, content) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_EMAIL,
            pass: process.env.MAIL_PASS,
        }
    });

    const options = {
        from: `${process.env.MAIL_NAME} <${process.env.MAIL_EMAIL}>`,
        to: to,
        subject: subject,
        html: content,
    }

    return transporter.sendMail(options);
}

const sendMailTemplate = (to, subject, template, context) => {
    const handlebarsConfig = {
        viewEngine: {
            extName: ".hbs",
            partialsDir: path.join(__dirname, '../views/mail'),
            layoutsDir: path.join(__dirname, '../views/mail'),
            defaultLayout: ''
        },
        viewPath: path.join(__dirname, '../views/mail'),
        extName: '.hbs',
    }

    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_EMAIL,
            pass: process.env.MAIL_PASS,
        }
    });

    transporter.use("compile", handlebars(handlebarsConfig));

    const options = {
        from: `${process.env.MAIL_NAME} <${process.env.MAIL_EMAIL}>`,
        to: to,
        subject: subject,
        template: template,
        context: context,
    }

    return transporter.sendMail(options);
}

module.exports = {
    sendMail: sendMail,
    sendMailTemplate: sendMailTemplate,
}