import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Surgery from '@/app/models/surgery';
import User from '@/app/models/User';
import Offer from '@/app/models/Offer';
import Job from '@/app/models/Job';
import { mailSender, mainClient } from '@/lib/mail';
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    // Connect to MongoDB
    await dbConnect();

    let surgeries = [];

    // Fetch surgeries based on user role
    if (userRole === 'surgeon') {
      // Get surgeries where the user is the surgeon
      surgeries = await Surgery.find({ surgeonId: userId })
        .populate({
          path: 'patientId',
          model: User,
          select: 'name email image',
        })
        .populate({
          path: 'jobId',
          select: 'title description createdAt',
        })
        .populate({
          path: 'offerId',
          model: Offer,
          select: 'cost date location status description ',
        })
        .sort({ scheduledDate: 1 }); // Sort by upcoming surgeries
    } else if (userRole === 'patient') {
      // Get surgeries where the user is the patient
      surgeries = await Surgery.find({ patientId: userId })
        .populate({
          path: 'surgeonId',
          model: User,
          select: 'name email image',
        })
        .populate({
          path: 'jobId',
          select: 'title description createdAt',
        })
        .populate({
          path: 'offerId',
          model: Offer, // Add this line with the Offer model
          select: 'cost date location status description ',
        })
        .sort({ scheduledDate: 1 }); // Sort by upcoming surgeries
    } else {
      // For other roles (admin, etc.)
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    return NextResponse.json({ surgeries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching surgeries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surgeries' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { surgeryId } = await req.json();
    if (!surgeryId) {
      return NextResponse.json(
        { error: 'Surgery ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Populate all necessary fields to include in the email
    const surgery = await Surgery.findById(surgeryId)
      .populate({
        path: 'jobId',
        select: 'title type date description',
      })
      .populate({
        path: 'patientId',
        model: User,
        select: 'name email',
      })
      .populate({
        path: 'surgeonId',
        model: User,
        select: 'name email',
      })
      .populate({
        path: 'offerId',
        model: Offer,
        select: 'cost date location description',
      });

    if (!surgery) {
      return NextResponse.json({ error: 'Surgery not found' }, { status: 404 });
    }

    // Update the surgery status
    surgery.status = 'waitingForAdminApproval';
    await surgery.save();

    // Update the related job status to 'closed'
    if (surgery.jobId) {
      await Job.findByIdAndUpdate(surgery.jobId._id, { status: 'closed' });
    }

     // Send notification email to admin
    try {
      const adminEmail = process.env.MAIL_TRAP_ADMIN_EMAIL!;
      const surgeryLink = `${process.env.NEXTAUTH_URL}/admin/surgeries/${surgeryId}`;
    
      await mainClient.send({
        from: mailSender,
        to: [{ email: adminEmail }],
        subject: `Surgery Completion Request - ${surgery.jobId.title}`,
        text: `
    Surgery Completion Request
    
    A surgeon has marked a surgery as complete and is awaiting admin approval.
    
    Surgery Details:
    Job Title: ${surgery.jobId.title}
    Job Type: ${surgery.jobId.type}
    Scheduled Date: ${new Date(surgery.offerId.date).toLocaleDateString()}
    Location: ${surgery.offerId.location}
    Cost: $${surgery.offerId.cost}
    
    Patient: ${surgery.patientId.name} (${surgery.patientId.email})
    Surgeon: ${surgery.surgeonId.name} (${surgery.surgeonId.email})
    
    This surgery is now in 'Waiting for Admin Approval' status. Please review and confirm completion.
    
    Review Link: ${surgeryLink}
        `,
        html: `
    <div>
      <h1>Surgery Completion Request</h1>
      
      <p>A surgeon has marked a surgery as complete and is awaiting admin approval.</p>
      
      <div>
        <h2>Surgery Details</h2>
        <p><strong>Job Title:</strong> ${surgery.jobId.title}</p>
        <p><strong>Job Type:</strong> ${surgery.jobId.type}</p>
        <p><strong>Scheduled Date:</strong> ${new Date(surgery.offerId.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${surgery.offerId.location}</p>
        <p><strong>Cost:</strong> $${surgery.offerId.cost}</p>
      </div>
      
      <div>
        <div>
          <h3>Patient</h3>
          <p>${surgery.patientId.name}</p>
          <p>${surgery.patientId.email}</p>
        </div>
        
        <div>
          <h3>Surgeon</h3>
          <p>${surgery.surgeonId.name}</p>
          <p>${surgery.surgeonId.email}</p>
        </div>
      </div>
      
      <p>This surgery is now in <strong>Waiting for Admin Approval</strong> status. Please review and confirm completion.</p>
      
      <div>
        <a href="${surgeryLink}">Review Surgery</a>
      </div>
    </div>
        `,
        category: 'Surgery Completion Request',
      });
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      // Continue with the response even if the email fails
      // We still want to update the surgery status
    }

    return NextResponse.json(
      { message: 'Surgery updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating surgery:', error);
    return NextResponse.json(
      { error: 'Failed to update surgery' },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
// import { mainClient, mailSender } from '@/lib/mail';

// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     const {
//       jobTitle,
//       jobType,
//       jobDate,
//       invitedSurgeons,
//       userName,
//       userEmail,
//       link,
//     } = await req.json();

//     // Always send a generic response
//     const genericMessage = {
//       message: 'Invitation details have been sent to the admin',
//     };

//     const adminEmail = process.env.MAIL_TRAP_ADMIN_EMAIL!; // change the admin email here
//     console.log('adminEmail', adminEmail);
//     try {
//       await mainClient.send({
//         from: mailSender,
//         to: [{ email: adminEmail }],
//         subject: `New Surgery Invitation - ${jobTitle}`,
//         text: `Job Details:
// Title: ${jobTitle}
// Type: ${jobType}
// Surgeory Date: ${new Date(jobDate).toLocaleDateString()}

// Invited Surgeons:
// ${invitedSurgeons.join('\n')}

// Job Link: ${link}

// Submitted by: ${userName} (${userEmail})`,
//         html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
//           <h1 style="color: #2563eb;">Job Details</h1>
//           <p><strong>Title:</strong> ${jobTitle}</p>
//           <p><strong>Type:</strong> ${jobType}</p>
//           <p><strong>Date:</strong> ${new Date(
//             jobDate
//           ).toLocaleDateString()}</p>

//           <h2 style="color: #2563eb; margin-top: 20px;">Invited Surgeons:</h2>
//           <ul style="list-style: none; padding: 0;">
//             ${invitedSurgeons
//               .map(
//                 (email: string) => `
//               <li style="margin-bottom: 8px;">
//                 <span style="color: #6b7280;">•</span> ${email}
//               </li>
//             `
//               )
//               .join('')}
//           </ul>

//           <div style="margin-top: 20px;">
//             <a href="${link}"
//                style="background-color: #2563eb; color: white;
//                       padding: 10px 20px; text-decoration: none;
//                       border-radius: 5px; display: inline-block;">
//               View Job Posting
//             </a>
//           </div>

//           <p style="margin-top: 20px;">
//             <strong>Submitted by:</strong><br>
//             ${userName}<br>
//             ${userEmail}
//           </p>
//         </div>`,
//         category: 'Surgery Invitation',
//       });
//     } catch (error) {
//       console.error('Error sending email:', error);
//       return NextResponse.json(
//         { error: 'Failed to send invitation' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(genericMessage);
//   } catch (error) {
//     console.error('Error in send-invites:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const { surgeryId } = await req.json();
//     if (!surgeryId) {
//       return NextResponse.json(
//         { error: 'Surgery ID is required' },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     // Populate all necessary fields to include in the email
//     const surgery = await Surgery.findById(surgeryId)
//       .populate({
//         path: 'jobId',
//         select: 'title type date description',
//       })
//       .populate({
//         path: 'patientId',
//         model: User,
//         select: 'name email',
//       })
//       .populate({
//         path: 'surgeonId',
//         model: User,
//         select: 'name email',
//       })
//       .populate({
//         path: 'offerId',
//         model: Offer,
//         select: 'cost date location description',
//       });

//     if (!surgery) {
//       return NextResponse.json({ error: 'Surgery not found' }, { status: 404 });
//     }

//     // Update the surgery status
//     surgery.status = 'waitingForAdminApproval';
//     await surgery.save();

//     // Update the related job status to 'closed'
//     if (surgery.jobId) {
//       await Job.findByIdAndUpdate(surgery.jobId._id, { status: 'closed' });
//     }

//     // Send notification email to admin
//     try {
//       const adminEmail = process.env.MAIL_TRAP_ADMIN_EMAIL!;
//       const surgeryLink = `${process.env.NEXTAUTH_URL}/admin/surgeries/${surgeryId}`;

//       await mainClient.send({
//         from: mailSender,
//         to: [{ email: adminEmail }],
//         subject: `Surgery Completion Request - ${surgery.jobId.title}`,
//         text: `
// Surgery Completion Request

// A surgeon has marked a surgery as complete and is awaiting admin approval.

// Surgery Details:
// Job Title: ${surgery.jobId.title}
// Job Type: ${surgery.jobId.type}
// Scheduled Date: ${new Date(surgery.offerId.date).toLocaleDateString()}
// Location: ${surgery.offerId.location}
// Cost: $${surgery.offerId.cost}

// Patient: ${surgery.patientId.name} (${surgery.patientId.email})
// Surgeon: ${surgery.surgeonId.name} (${surgery.surgeonId.email})

// This surgery is now in 'Waiting for Admin Approval' status. Please review and confirm completion.

// Review Link: ${surgeryLink}
//         `,
//         html: `
// <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
//   <h1 style="color: #3b82f6; margin-top: 0;">Surgery Completion Request</h1>

//   <p style="color: #4b5563;">A surgeon has marked a surgery as complete and is awaiting admin approval.</p>

//   <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
//     <h2 style="color: #1f2937; margin-top: 0; font-size: 18px;">Surgery Details</h2>
//     <p style="margin: 8px 0;"><strong>Job Title:</strong> ${
//       surgery.jobId.title
//     }</p>
//     <p style="margin: 8px 0;"><strong>Job Type:</strong> ${
//       surgery.jobId.type
//     }</p>
//     <p style="margin: 8px 0;"><strong>Scheduled Date:</strong> ${new Date(
//       surgery.offerId.date
//     ).toLocaleDateString()}</p>
//     <p style="margin: 8px 0;"><strong>Location:</strong> ${
//       surgery.offerId.location
//     }</p>
//     <p style="margin: 8px 0;"><strong>Cost:</strong> $${
//       surgery.offerId.cost
//     }</p>
//   </div>

//   <div style="display: flex; margin-bottom: 24px;">
//     <div style="flex: 1; background-color: #f0fdf4; border-radius: 8px; padding: 16px; margin-right: 8px;">
//       <h3 style="color: #166534; margin-top: 0;">Patient</h3>
//       <p style="margin: 4px 0;">${surgery.patientId.name}</p>
//       <p style="margin: 4px 0; color: #4b5563; font-size: 14px;">${
//         surgery.patientId.email
//       }</p>
//     </div>

//     <div style="flex: 1; background-color: #eff6ff; border-radius: 8px; padding: 16px; margin-left: 8px;">
//       <h3 style="color: #1e40af; margin-top: 0;">Surgeon</h3>
//       <p style="margin: 4px 0;">${surgery.surgeonId.name}</p>
//       <p style="margin: 4px 0; color: #4b5563; font-size: 14px;">${
//         surgery.surgeonId.email
//       }</p>
//     </div>
//   </div>

//   <p style="color: #4b5563;">This surgery is now in <strong style="color: #f59e0b;">Waiting for Admin Approval</strong> status. Please review and confirm completion.</p>

//   <div style="text-align: center; margin-top: 32px;">
//     <a href="${surgeryLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">Review Surgery</a>
//   </div>
// </div>
//         `,
//         category: 'Surgery Completion Request',
//       });
//     } catch (emailError) {
//       console.error('Error sending admin notification email:', emailError);
//       // Continue with the response even if the email fails
//       // We still want to update the surgery status
//     }

//     return NextResponse.json(
//       { message: 'Surgery updated successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error updating surgery:', error);
//     return NextResponse.json(
//       { error: 'Failed to update surgery' },
//       { status: 500 }
//     );
//   }
// }
