import { auth } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div>
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">Name</h4>
          <p>{session.user.name}</p>
        </div>
        <div>
          <h4 className="font-semibold">Email</h4>
          <p>{session.user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
} 