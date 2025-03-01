import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config({
  path:'../../.env'
})

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service:process.env.SERVICE,
    port:Number(process.env.EMAIL_PORT),
    secure:Boolean(process.env.SECURE), // true for port 465, false for other ports
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  
  const sendEmail=async(email,verificationCode)=>{
    try {
        const info = await transporter.sendMail({
            from: '"say hello 👻" <sayhello@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your email", // Subject line
            text: "", // plain text body
            html: `<b>your verification code is ${verificationCode}</b>`, // html body
          });
          return info
    } catch (error) {
        console.log("error while sending email",error)
        return
    }
  }
  

export {sendEmail}