import nodemailer from 'nodemailer'
export async function sendEmail(dest, subject, message, attachments = []) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.nodeMailerEmail, // generated ethereal user
            pass: process.env.nodeMailerPassword, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Aira Solutions" < ${process.env.nodeMailerEmail}>`, // sender address
        to: dest, // list of receivers
        subject, // Subject line
        html: message, // html body
        attachments
    });
    return info
}

export async function sendEmailFeedBack(from, name, subject, message, attachments = []) {
console.log(process.env.nodeMailerEmail);
console.log(process.env.nodeMailerPassword);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.nodeMailerEmail, // generated ethereal user
            pass: process.env.nodeMailerPassword, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"${name}" <${from}>`, // sender address
        to: `"Aira Solutions" <${process.env.nodeMailerEmail}>`, // list of receivers
        subject, // Subject line
        html: message, // html body
        attachments
    });
    return info
}
