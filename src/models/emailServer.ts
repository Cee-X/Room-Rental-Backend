import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport ({
    service: 'gmail',
    auth: {
        user: 'kyawthethtwe595@gmail.com',
        pass : 'kyaw221199#'
    }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: 'kyawthethtwe595@gmail.com',
        to,
        subject,
        text
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully')
    }catch(error){
        console.error('Error sending email', error)
    }
}