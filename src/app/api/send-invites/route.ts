import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { mainClient, mailSender } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const {
      jobTitle,
      jobType,
      jobDate,
      invitedSurgeons,
      userName,
      userEmail,
      link,
    } = await req.json();

    // Always send a generic response
    const genericMessage = {
      message: 'Invitation details have been sent to the admin',
    };

    const adminEmail = process.env.MAIL_TRAP_ADMIN_EMAIL!; // change the admin email here
    console.log('adminEmail', adminEmail);
    try {
      await mainClient.send({
        from: mailSender,
        to: [{ email: adminEmail }],
        subject: `New Surgery Invitation - ${jobTitle}`,
        text: `Job Details:
Title: ${jobTitle}
Type: ${jobType}
Surgeory Date: ${new Date(jobDate).toLocaleDateString()}

Invited Surgeons:
${invitedSurgeons.join('\n')}

Job Link: ${link}

Submitted by: ${userName} (${userEmail})`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h1 style="color: #2563eb;">Job Details</h1>
          <p><strong>Title:</strong> ${jobTitle}</p>
          <p><strong>Type:</strong> ${jobType}</p>
          <p><strong>Date:</strong> ${new Date(
            jobDate
          ).toLocaleDateString()}</p>
          
          <h2 style="color: #2563eb; margin-top: 20px;">Invited Surgeons:</h2>
          <ul style="list-style: none; padding: 0;">
            ${invitedSurgeons
              .map(
                (email: string) => `
              <li style="margin-bottom: 8px;">
                <span style="color: #6b7280;">•</span> ${email}
              </li>
            `
              )
              .join('')}
          </ul>

          <div style="margin-top: 20px;">
            <a href="${link}" 
               style="background-color: #2563eb; color: white; 
                      padding: 10px 20px; text-decoration: none; 
                      border-radius: 5px; display: inline-block;">
              View Job Posting
            </a>
          </div>

          <p style="margin-top: 20px;">
            <strong>Submitted by:</strong><br>
            ${userName}<br>
            ${userEmail}
          </p>
        </div>`,
        category: 'Surgery Invitation',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json(genericMessage);
  } catch (error) {
    console.error('Error in send-invites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
