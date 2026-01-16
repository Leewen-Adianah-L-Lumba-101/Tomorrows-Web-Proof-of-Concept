import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.static('src'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.VITE_USER_GMAIL,
    pass: process.env.VITE_API_KEY,
  },
});

app.post('/sendmail', async (req: any, res: any) => {
  const { name, email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const htmlfileData = `
    <head>
      <style>
        * { 
          margin: 0; 
          padding: 0; 
        }
        body {
          justify-content: center; 
          text-align: center; 
        }

        img { 
          height: auto; 
        }
      
      </style>
    </head>
    <body>
      <div><img src="cid:hangit-logo-full.svg" alt="Hangit Logo"/></div>
      <h1>Welcome to HANGIT, ${name}!</h1>
      <p>THANK YOU FOR SIGNING UP!</p>
    </body>
  `;

  const mailinfo = {
    to: email,
    subject: 'Welcome to HANGIT!',
    html: htmlfileData,
    attachments: [{
      filename: 'hangit-logo-full.svg',
      path: 'src/assets/hangit-logo-full.svg',
      contentDisposition: 'inline' as const,
      cid: 'hangit-logo-full.svg',
      contentType: 'image/svg+xml',
    }],
  };

  try {
    await transporter.sendMail(mailinfo);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(process.cwd(), 'src/pages/register.tsx'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});