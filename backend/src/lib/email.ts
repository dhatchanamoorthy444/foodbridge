import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(options: {
  to: string
  subject: string
  text: string
  html?: string
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'FoodBridge <noreply@foodbridge.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })

    console.log('✅ Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendExpiryWarningEmail(
  email: string,
  foodItem: any,
  daysUntilExpiry: number
) {
  const subject = `⚠️ Expiry Warning - ${foodItem.name} - ${daysUntilExpiry} days remaining`
  const text = `
Expiry Warning - FoodBridge

The following item is approaching its expiry date:

Item: ${foodItem.name}
Category: ${foodItem.category}
Expiry Date: ${foodItem.expiry_date}
Days Remaining: ${daysUntilExpiry}

Please schedule a pickup soon to avoid waste.

Take action now to help reduce food waste!
  `

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Expiry Warning - FoodBridge</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #ef4444; border-radius: 5px;">
        <h1 style="color: #ef4444;">⚠️ Expiry Warning</h1>
        <p>The following item is approaching its expiry date:</p>
        <p><strong>Item:</strong> ${foodItem.name}</p>
        <p><strong>Category:</strong> ${foodItem.category}</p>
        <p><strong>Expiry Date:</strong> ${foodItem.expiry_date}</p>
        <p><strong>Days Remaining:</strong> ${daysUntilExpiry}</p>
        <p>Please schedule a pickup soon to avoid waste.</p>
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">Take action now to help reduce food waste!</p>
        </div>
    </div>
</body>
</html>
  `

  return sendEmail({ to: email, subject, text, html })
}