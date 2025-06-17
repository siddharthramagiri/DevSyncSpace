'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const acceptInvite = async () => {
      const projectId = searchParams?.get('projectId');
      const userId = searchParams?.get('userId');

      if (!projectId || !userId) {
        setStatus("Invalid invitation link.");
        return;
      }

      try {
        const res = await fetch('/api/invite/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectId, userId }),
        });

        if (res.ok) {
          setStatus("Successfully joined the team!");
          setTimeout(() => router.push('/app/dashboard'), 2000);
        } else {
          setStatus("Failed to accept the invitation.");
        }
      } catch (error) {
        setStatus("An error occurred while processing the invitation.");
      }
    };

    acceptInvite();
  }, [searchParams, router]);

  return <div className="p-4 text-lg">{status}</div>;
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="p-4 text-lg">Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}