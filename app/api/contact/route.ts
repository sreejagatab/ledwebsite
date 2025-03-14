import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Define validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

// Rate limiting setup
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestMap = new Map<string, { count: number, timestamp: number }>();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate form data
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const formData = validationResult.data;
    
    // Send email notification
    await sendEmailNotification(formData);
    
    // Store in database (implementation depends on your database choice)
    await storeContactSubmission(formData);
    
    // Return success response
    return NextResponse.json({ success: true, message: 'Form submitted successfully' });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

// Helper function to check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestMap.get(ip);
  
  if (!record) {
    ipRequestMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    // Reset if window has passed
    ipRequestMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true; // Rate limit exceeded
  }
  
  // Increment count
  ipRequestMap.set(ip, { count: record.count + 1, timestamp: record.timestamp });
  return false;
}

// Helper function to send email notification
async function sendEmailNotification(formData: z.infer<typeof contactFormSchema>) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@luminatechled.com',
    to: process.env.EMAIL_TO || 'contact@luminatechled.com',
    subject: 'New Contact Form Submission',
    text: `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone || 'Not provided'}
      Company: ${formData.company || 'Not provided'}
      Project Type: ${formData.projectType || 'Not provided'}
      Message: ${formData.message}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
      <p><strong>Project Type:</strong> ${formData.projectType || 'Not provided'}</p>
      <p><strong>Message:</strong> ${formData.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Helper function to store contact submission in database
async function storeContactSubmission(formData: z.infer<typeof contactFormSchema>) {
  // This implementation will depend on your database choice
  // For example, with Prisma:
  /*
  await prisma.contactSubmission.create({
    data: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      projectType: formData.projectType,
      message: formData.message,
      createdAt: new Date(),
    },
  });
  */
  
  // For now, we'll just log it
  console.log('Storing contact submission:', formData);
} 