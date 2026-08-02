import { getSessionProfile } from "@/lib/data/account";
import { ProfileForm } from "@/components/account/profile-form";

export default async function ProfilePage() {
  const session = await getSessionProfile();
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Profile</h1>
        <p className="mt-1 text-ink-500">Keep your research account details up to date.</p>
      </div>
      <ProfileForm
        email={session.email}
        initial={{
          fullName: session.profile?.full_name ?? "",
          organizationName: session.profile?.organization_name ?? "",
          department: session.profile?.department ?? "",
          jobTitle: session.profile?.job_title ?? "",
          phone: session.profile?.phone ?? "",
        }}
      />
    </div>
  );
}
