// .../app/invite/accept/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const acceptInvite = async () => {
      const projectId = searchParams.get('projectId');
      const userId = searchParams.get('userId');

      if (!projectId || !userId) {
        setStatus("Invalid invitation link.");
        return;
      }

      const res = await fetch('/api/invite/accept', {
        method: 'POST',
        body: JSON.stringify({ projectId, userId }),
      });

      if (res.ok) {
        setStatus("Successfully joined the team!");
        setTimeout(() => router.push('/app/dashboard'), 2000);
      } else {
        setStatus("Failed to accept the invitation.");
      }
    };

    acceptInvite();
  }, [searchParams, router]);

  return <div className="p-4 text-lg">{status}</div>;
}
