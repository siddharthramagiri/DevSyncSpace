// lib/mail.ts
import getProjectById from '@/app/api/projects/getProjectById';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendInvitationEmail({
  to,
  fromName,
  projectId,
  userId,
}: {
  to: string;
  fromName: string;
  projectId: string;
  userId: string;
}) {
  const inviteUrl = `${process.env.NEXTAUTH_URL}/app/invite/accept?projectId=${projectId}&userId=${userId}`;

  const { project, error } = await getProjectById(projectId);
  if(!project || error) {
    console.log(error);
  }

  await transporter.sendMail({
    from: `"${fromName}" <noreply@devsyncspace.org>`,
    to,
    subject: `Project Invitation from ${fromName}`,
    html: `
      <p>You have been invited to join a project 
      <b>"${project?.title}"</b> 
      on DevSyncSpace platform.</p>
      <p><a href="${inviteUrl}">Click here to accept the invitation</a></p>
    `,
  });
}
