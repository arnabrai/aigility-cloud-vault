
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const { user, signOut, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (user) {
      setEmail(user.email || "");
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleUpdateEmail = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingEmail(true);
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your email to confirm the change",
      });
    } catch (error: any) {
      toast({
        title: "Error updating email",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setUpdatingEmail(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            User ID: {user?.id}
          </div>
          <div className="text-sm text-gray-500">
            Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdateEmail} 
            disabled={updatingEmail || email === user?.email}
          >
            {updatingEmail ? "Updating..." : "Update Email"}
          </Button>
        </CardFooter>
      </Card>
      
      <Separator className="my-6" />
      
      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Account;
