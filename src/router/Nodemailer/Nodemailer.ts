import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
    {
        host: "smtp.mail.ru",
        port: 465,
        secure: true, // if 465 true else false
        auth: {
            user: "",
            pass: "",
        },
    },
    {
        from: "",
    },
);

export const mailer= (message):void => {
    transporter.sendMail(message,(err:Error):void => {
        if (err) console.log('email dont exist')
    });
};