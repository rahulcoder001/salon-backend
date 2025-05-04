// sendEmailRoutes.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.HOSTINGER_EMAIL, // example: Info@ashtcabservices.in
      pass: process.env.HOSTINGER_PASS,   // the real password from Hostinger
    },
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
const Sendotp =  (req, res) => {
    const { to } = req.body;
    
    if (!to) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    const otp = generateOTP();
    const subject = 'Your SalonSphere One-Time Password (OTP)';
    const html = createOTPEmailTemplate(otp);
    const text = `Your SalonSphere OTP code is: ${otp}\nThis code is valid for 10 minutes.`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
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
};
// Welcome email template
const createWelcomeEmailTemplate = (userName) => {
    const roseGold = '#b76e79';
    const logoUrl = 'https://media-hosting.imagekit.io/8c61e3272696411c/logo.png?Expires=1838300894&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1mLOEl3gs1bcMCgUDk-gZVeJPDyiN1iwxhbYp4ZIzez2GOaQM9MVT8cHkIFww1783r3R9UNO0enMxKX~rOaCJp5~qlEGe8K0d67xUh55~d9FOpLLXMtSG0AAYJiFk2tUjbBvCn0gvDVNoAvNab09GQ5Ov-l7-TTKJ4muIDQovYSOL9tbb17TV4Vf2h54zH6ls9NVGGhMJdJBKdx~62Ok-Mb8kTSdmR0jMKuwjixbxE4MLxaP29WYX4yeQjv3EFhRrFvB4~FryVtFf-8odMOd4rTFwPw9TSfISFxSvygxm~tL7ndcTKkVeuSCRFCgi2bCedZLSXPPwu44xW5839sYKQ__';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SalonSphere!</title>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
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
                animation: float 3s ease-in-out infinite;
            }
            .company-name {
                font-family: 'Dancing Script', cursive;
                font-size: 36px;
                font-weight: 700;
                margin: 10px 0 0;
                color: ${roseGold};
                text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
            }
            .content {
                padding: 30px;
                animation: fadeIn 0.7s ease-out;
            }
            .welcome-text {
                font-size: 24px;
                color: ${roseGold};
                margin: 20px 0;
                text-align: center;
            }
            .cta-section {
                text-align: center;
                margin: 30px 0;
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
            .features {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin: 30px 0;
            }
            .feature-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #eee;
                text-align: center;
                transition: all 0.3s ease;
            }
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(183, 110, 121, 0.1);
            }
            .footer {
                text-align: center;
                padding: 20px;
                background: #f5f7fa;
                color: #666;
                font-size: 12px;
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
                <h1>Welcome to the Family, ${userName}!</h1>
            </div>
            <div class="content">
                <div class="welcome-text">
                    Your Beauty Journey Begins Here ✨
                </div>

                <div class="cta-section">
                    <a href="#" class="button">Book Your First Appointment</a>
                </div>

                <div class="features">
                    <div class="feature-card">
                        <h3>📅 Easy Booking</h3>
                        <p>Schedule appointments 24/7 with our instant booking system</p>
                    </div>
                    <div class="feature-card">
                        <h3>💎 Exclusive Offers</h3>
                        <p>Get special members-only discounts and early access</p>
                    </div>
                    <div class="feature-card">
                        <h3>🌟 Loyalty Rewards</h3>
                        <p>Earn points with every visit and redeem exclusive perks</p>
                    </div>
                    <div class="feature-card">
                        <h3>📱 Mobile App</h3>
                        <p>Manage bookings and rewards on our iOS/Android app</p>
                    </div>
                </div>

                <div class="note">
                    <p>Need help? Contact our support team at <span class="highlight">support@salonsphere.com</span></p>
                    <p>Follow us on social media for beauty tips and special offers!</p>
                </div>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} <span class="highlight">SalonSphere</span>. All rights reserved.</p>
                <p>Redefining beauty experiences since 2024</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Route to send welcome email
const welcomMail = (req, res) => {
    const { to, userName } = req.body;
    
    if (!to || !userName) {
        return res.status(400).json({ error: 'Email address and user name are required' });
    }

    const createWelcomeEmailTemplate = (userName) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: #fff8f9; 
                border-radius: 10px; 
                padding: 30px;
                font-family: 'Segoe UI', sans-serif;
            }
            .header {
                background: #b76e79;
                color: white;
                padding: 25px;
                border-radius: 10px;
                text-align: center;
            }
            .features-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 25px 0;
            }
            .feature-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(183,110,121,0.1);
            }
            .emoji-icon {
                font-size: 28px;
                margin-bottom: 10px;
            }
            .cta-button {
                display: inline-block;
                background: #b76e79;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Salon Management Simplified 🧑💼</h1>
                <p>Welcome ${userName}!</p>
            </div>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="emoji-icon">📊</div>
                    <h3>Financial Reports</h3>
                    <p>Track daily revenue & expenses</p>
                </div>
                <div class="feature-card">
                    <div class="emoji-icon">👥</div>
                    <h3>Staff Management</h3>
                    <p>Schedule shifts & payroll</p>
                </div>
                <div class="feature-card">
                    <div class="emoji-icon">📦</div>
                    <h3>Inventory Control</h3>
                    <p>Smart stock alerts</p>
                </div>
                <div class="feature-card">
                    <div class="emoji-icon">📅</div>
                    <h3>Appointments</h3>
                    <p>Client booking system</p>
                </div>
            </div>

            <center>
                <a href="https://salon.edubotix.online/" class="cta-button">Start Managing →</a>
                <p style="color: #666; margin-top: 25px;">
                    Need help? Contact support@salonsphere.com
                </p>
            </center>
        </div>
    </body>
    </html>
    `;

    const subject = `Welcome to SalonSphere, ${userName}! 🎉`;
    const html = createWelcomeEmailTemplate(userName);
    const text = `Welcome to SalonSphere, ${userName}!\n\n`
               + "We're excited to help you manage your salon business!\n"
               + "Access your dashboard to start managing staff, appointments, and finances.\n\n"
               + "Best regards,\nThe SalonSphere Team";

               const mailOptions = {
                from: process.env.EMAIL_FROM,
                to,
                subject,
                text,
                html,
              };
              

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending welcome email:', error);
            return res.status(500).json({ error: 'Failed to send welcome email' });
        }
        console.log('Welcome email sent:', info.response);
        res.status(200).json({ 
            message: 'Welcome email sent successfully',
            info 
        });
    });
};

const forgotPasswordMail = (req, res) => {
    const { to } = req.body;
    
    // Validate email
    if (!to) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    // Generate 6-digit OTP
    const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
    const otp = generateOTP().toString();

    // HTML Template
    const createPasswordResetTemplate = (otp) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { 
                max-width: 600px; 
                margin: 2rem auto; 
                background: #fff8f9; 
                border-radius: 15px; 
                overflow: hidden;
                font-family: 'Segoe UI', sans-serif;
            }
            .header {
                background: #b76e79;
                color: white;
                padding: 2rem;
                text-align: center;
            }
            .otp-section {
                padding: 2rem;
                text-align: center;
                background: white;
                margin: 2rem;
                border-radius: 10px;
                border: 2px dashed #e7d4d6;
            }
            .otp-code {
                font-size: 2.5rem;
                letter-spacing: 0.5rem;
                color: #b76e79;
                margin: 1rem 0;
                font-weight: 700;
            }
            .note {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.6;
                margin: 1rem 0;
            }
            .button {
                display: inline-block;
                background: #b76e79;
                color: white;
                padding: 0.8rem 2rem;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SalonSphere Password Reset 🔒</h1>
                <p>Your Security is Our Priority</p>
            </div>

            <div class="otp-section">
                <p class="note">Use this OTP to reset your password:</p>
                <div class="otp-code">${otp}</div>
                <p class="note" style="color: #c23b3b;">Valid for 10 minutes only</p>
            </div>

            <div style="text-align: center; padding: 1rem;">
                <p class="note">If you didn't request this, please ignore this email or contact our support team immediately.</p>
                <a href="https://salon.edubotix.online" class="button">Visit SalonSphere</a>
            </div>
        </div>
    </body>
    </html>
    `;

    // Email configuration
    const subject = "SalonSphere Password Reset OTP 🔑";
    const html = createPasswordResetTemplate(otp);
    const text = `SalonSphere Password Reset\n\n`
               + `OTP: ${otp}\n`
               + "This OTP is valid for 10 minutes\n\n"
               + "If you didn't request this, please contact support.";

               const mailOptions = {
                from: process.env.EMAIL_FROM,
                to,
                subject,
                text,
                html,
              };
              

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Password reset email error:', error);
            return res.status(500).json({ 
                error: 'Failed to send password reset email',
                details: error.message 
            });
        }
        
        console.log('Password reset OTP sent:', info.response);
        res.status(200).json({
            message: 'Password reset OTP sent successfully',
            otp: otp, // Remove this in production
            info: info
        });
    });
};

const passwordResetConfirmation = (req, res) => {
    const { to } = req.body;

    // Validate email
    if (!to) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    // HTML Template
    const createConfirmationTemplate = () => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { 
                max-width: 600px; 
                margin: 2rem auto; 
                background: #f9f9f9; 
                border-radius: 15px; 
                overflow: hidden;
                font-family: 'Segoe UI', sans-serif;
            }
            .header {
                background: #4CAF50;
                color: white;
                padding: 2rem;
                text-align: center;
            }
            .checkmark {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .content-section {
                padding: 2rem;
                text-align: center;
                background: white;
                margin: 2rem;
                border-radius: 10px;
                border: 2px dashed #e7d4d6;
            }
            .success-text {
                color: #2E7D32;
                font-size: 1.5rem;
                margin: 1rem 0;
                font-weight: 600;
            }
            .note {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.6;
                margin: 1rem 0;
            }
            .button {
                display: inline-block;
                background: #4CAF50;
                color: white;
                padding: 0.8rem 2rem;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 1rem;
                transition: background 0.3s ease;
            }
            .button:hover {
                background: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="checkmark">✔</div>
                <h1>Password Updated Successfully!</h1>
            </div>

            <div class="content-section">
                <p class="success-text">Your SalonSphere password has been successfully reset</p>
                
                <p class="note">If you made this change:</p>
                <p class="note">🎉 Enjoy your secure account access!</p>
                
                <p class="note" style="color: #c23b3b;">
                    If you didn't make this change:<br>
                    🔒 Secure your account immediately by contacting our support team
                </p>
            </div>

            <div style="text-align: center; padding: 1rem;">
                <p class="note">Need help? Contact our 24/7 support team at support@salonsphere.com</p>
                <a href="https://salon.edubotix.online" class="button">Access Your Account</a>
            </div>
        </div>
    </body>
    </html>
    `;

    // Email configuration
    const subject = "Password Updated Successfully ✔ - SalonSphere";
    const html = createConfirmationTemplate();
    const text = `SalonSphere Password Reset Confirmation\n\n`
               + `Your password has been successfully updated.\n\n`
               + "If you didn't make this change, please contact our support team immediately.\n\n"
               + "Best regards,\n"
               + "SalonSphere Security Team";

               const mailOptions = {
                from: process.env.EMAIL_FROM,
                to,
                subject,
                text,
                html,
              };
              

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Confirmation email error:', error);
            return res.status(500).json({ 
                error: 'Failed to send confirmation email',
                details: error.message 
            });
        }
        
        console.log('Password reset confirmation sent:', info.response);
        res.status(200).json({
            message: 'Password reset confirmation sent successfully',
            info: info
        });
    });
};



module.exports = { Sendotp , welcomMail,forgotPasswordMail , passwordResetConfirmation};
