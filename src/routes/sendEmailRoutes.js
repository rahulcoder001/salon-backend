// sendEmailRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'satyammaurya9620@gmail.com',
        pass: 'dqmo znmw owai ijkq'
    }
});

// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

// Beautiful HTML template for OTP email
const createOTPEmailTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f7fa;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 30px;
            }
            .otp-container {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
                border: 1px dashed #6e8efb;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #6e8efb;
                margin: 15px 0;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background: #f5f7fa;
                color: #666;
                font-size: 12px;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 15px 0;
            }
            .note {
                font-size: 14px;
                color: #666;
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Your One-Time Password</h1>
            </div>
            <div class="content">
                <p>Hello there,</p>
                <p>We received a request to authenticate your account. Please use the following OTP to complete your verification:</p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                    <p>This code is valid for 10 minutes</p>
                </div>
                
                <p>If you didn't request this OTP, please ignore this email or contact our support team.</p>
                
                <div class="note">
                    <p>For security reasons, please don't share this OTP with anyone.</p>
                </div>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <p>123 Business Street, City, Country</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Route to send OTP email
router.post('/send-otp', (req, res) => {
    const { to } = req.body;
    
    if (!to) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    const otp = generateOTP();
    const subject = 'Your One-Time Password (OTP)';
    const html = createOTPEmailTemplate(otp);
    const text = `Your OTP code is: ${otp}\nThis code is valid for 10 minutes.`;

    const mailOptions = {
        from: '"Your App Name" <satyammaurya9620@gmail.com>',
        to,
        subject,
        text,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP email:', error);
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }
        console.log('OTP email sent:', info.response);
        res.status(200).json({ 
            message: 'OTP sent successfully',
            otp: otp, // In production, you might want to omit this or handle it differently
            info 
        });
    });
});

module.exports = router;