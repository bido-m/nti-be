import nodemailer from "nodemailer";

export const sendEmail = async ({to,subject,html}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:465,
    secure:true,
    auth: {
      user: "bidoraafat@gmail.com",
      pass: "ynrp bzrg mefl okpz"
    },
  });
  const info = await transporter.sendMail({
    from:"bidoraafat@gmail.com",
    to,
    subject,
    html
  });
};
