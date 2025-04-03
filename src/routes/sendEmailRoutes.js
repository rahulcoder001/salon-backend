// sendEmailRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');

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
    const roseGold = '#b76e79';
    const logoUrl = 'https://media-hosting.imagekit.io/8c61e3272696411c/logo.png?Expires=1838300894&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1mLOEl3gs1bcMCgUDk-gZVeJPDyiN1iwxhbYp4ZIzez2GOaQM9MVT8cHkIFww1783r3R9UNO0enMxKX~rOaCJp5~qlEGe8K0d67xUh55~d9FOpLLXMtSG0AAYJiFk2tUjbBvCn0gvDVNoAvNab09GQ5Ov-l7-TTKJ4muIDQovYSOL9tbb17TV4Vf2h54zH6ls9NVGGhMJdJBKdx~62Ok-Mb8kTSdmR0jMKuwjixbxE4MLxaP29WYX4yeQjv3EFhRrFvB4~FryVtFf-8odMOd4rTFwPw9TSfISFxSvygxm~tL7ndcTKkVeuSCRFCgi2bCedZLSXPPwu44xW5839sYKQ__'; // Replace with your actual logo URL
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code | SalonSphere</title>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
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
                animation: fadeIn 0.5s ease-out;
            }
            .header {
                background: linear-gradient(135deg, #f3e7e9, ${roseGold});
                color: white;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .logo {
                height: 60px;
                margin-bottom: 15px;
                animation: pulse 2s infinite;
            }
            .company-name {
                font-family: 'Dancing Script', cursive;
                font-size: 36px;
                font-weight: 700;
                margin: 10px 0 0;
                color: ${roseGold};
                text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
            }
            .header h1 {
                margin: 15px 0 0;
                font-size: 28px;
                color: #333;
            }
            .content {
                padding: 30px;
                animation: fadeIn 0.7s ease-out;
            }
            .otp-container {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
                border: 1px dashed ${roseGold};
                transition: all 0.3s ease;
            }
            .otp-container:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(183, 110, 121, 0.1);
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                color: ${roseGold};
                margin: 15px 0;
                font-family: 'IBM Plex Mono', monospace;
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
                background: linear-gradient(135deg, #f3e7e9, ${roseGold});
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 15px 0;
                transition: all 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 10px rgba(183, 110, 121, 0.2);
            }
            .note {
                font-size: 14px;
                color: #666;
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }
            .highlight {
                color: ${roseGold};
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="SalonSphere Logo" class="logo">
                <p class="company-name">SalonSphere</p>
                <h1>Your One-Time Password</h1>
            </div>
            <div class="content">
                <p>Hello there,</p>
                <p>We received a request to authenticate your <span class="highlight">SalonSphere</span> account. Please use the following OTP to complete your verification:</p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                    <p>This code is valid for <span class="highlight">10 minutes</span></p>
                </div>
                
                <p>If you didn't request this OTP, please ignore this email or contact our support team.</p>
                
                <div class="note">
                    <p>For security reasons, please don't share this OTP with anyone.</p>
                    <p>SalonSphere team will never ask for your password or OTP.</p>
                </div>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} <span class="highlight">SalonSphere</span>. All rights reserved.</p>
                <p>Delivering beauty and wellness solutions</p>
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
    const subject = 'Your SalonSphere One-Time Password (OTP)';
    const html = createOTPEmailTemplate(otp);
    const text = `Your SalonSphere OTP code is: ${otp}\nThis code is valid for 10 minutes.`;

    const mailOptions = {
        from: '"SalonSphere" <satyammaurya9620@gmail.com>',
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
            otp: otp, // Note: Remove this in production
            info 
        });
    });
});

module.exports = router;