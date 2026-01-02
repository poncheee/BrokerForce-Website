import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Sign In form state
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showLinkingDialog, setShowLinkingDialog] = useState(false);
  const [linkingInfo, setLinkingInfo] = useState<{ email: string; name: string } | null>(null);

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const result = await authService.checkUsername(username);
      setUsernameAvailable(result.available);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Validate password requirements
  const validatePasswordRequirements = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("One number");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("One special character");
    }
    return errors;
  };

  // Update password errors when password changes
  const handlePasswordChange = (password: string) => {
    setRegisterPassword(password);
    if (password.length > 0) {
      setPasswordErrors(validatePasswordRequirements(password));
    } else {
      setPasswordErrors([]);
    }
  };

  // Handle username/password sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authService.loginWithPassword({
        username: signInUsername,
        password: signInPassword,
      });

      if (result.success && result.user) {
        await checkAuth(); // Refresh auth state
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${result.user.name}!`,
        });
        navigate("/");
      } else {
        toast({
          title: "Sign in failed",
          description: result.error || "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    authService.initiateGoogleLogin();
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent, linkToGoogle: boolean = false) => {
    e.preventDefault();

    // Validation
    if (!registerFirstName.trim()) {
      toast({
        title: "First name required",
        description: "Please enter your first name.",
        variant: "destructive",
      });
      return;
    }

    if (!registerLastName.trim()) {
      toast({
        title: "Last name required",
        description: "Please enter your last name.",
        variant: "destructive",
      });
      return;
    }

    if (!registerEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    const passwordValidationErrors = validatePasswordRequirements(registerPassword);
    if (passwordValidationErrors.length > 0) {
      toast({
        title: "Password requirements not met",
        description: `Password must contain: ${passwordValidationErrors.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    if (usernameAvailable === false) {
      toast({
        title: "Username unavailable",
        description: "Please choose a different username.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        username: registerUsername,
        password: registerPassword,
        firstName: registerFirstName.trim(),
        lastName: registerLastName.trim(),
        email: registerEmail.trim(),
        linkToGoogleAccount: linkToGoogle,
      });

      // Check if account linking is needed
      if (result.needsLinking) {
        setLinkingInfo({
          email: result.existingUser?.email || registerEmail,
          name: result.existingUser?.name || "",
        });
        setShowLinkingDialog(true);
        setLoading(false);
        return;
      }

      if (result.success && result.user) {
        await checkAuth(); // Refresh auth state
        toast({
          title: result.linked ? "Accounts linked successfully" : "Account created successfully",
          description: `Welcome, ${result.user.name || `${result.user.firstName} ${result.user.lastName}`}!`,
        });
        navigate("/");
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account linking confirmation
  const handleConfirmLinking = async () => {
    setShowLinkingDialog(false);
    setLoading(true);

    try {
      const result = await authService.register({
        username: registerUsername,
        password: registerPassword,
        firstName: registerFirstName.trim(),
        lastName: registerLastName.trim(),
        email: registerEmail.trim(),
        linkToGoogleAccount: true,
      });

      if (result.success && result.user) {
        await checkAuth(); // Refresh auth state
        toast({
          title: "Accounts linked successfully",
          description: `Welcome back! Your accounts are now linked. You can sign in with either Google or your username/password.`,
        });
        navigate("/");
      } else {
        toast({
          title: "Account linking failed",
          description: result.error || "Failed to link accounts",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Account linking error:", error);
      toast({
        title: "Account linking failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to BrokerForce</CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-4">
                  {/* Google Sign In Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  {/* Username/Password Sign In Form */}
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-username">Username</Label>
                      <Input
                        id="signin-username"
                        type="text"
                        placeholder="Enter your username"
                        value={signInUsername}
                        onChange={(e) => setSignInUsername(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  {/* Google Register Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={(e) => handleRegister(e, false)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-first-name">First Name *</Label>
                        <Input
                          id="register-first-name"
                          type="text"
                          placeholder="First name"
                          value={registerFirstName}
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-last-name">Last Name *</Label>
                        <Input
                          id="register-last-name"
                          type="text"
                          placeholder="Last name"
                          value={registerLastName}
                          onChange={(e) => setRegisterLastName(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username *</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username (3-20 characters)"
                        value={registerUsername}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                          setRegisterUsername(value);
                          checkUsernameAvailability(value);
                        }}
                        required
                        disabled={loading}
                        minLength={3}
                        maxLength={20}
                      />
                      {checkingUsername && (
                        <p className="text-xs text-muted-foreground">Checking availability...</p>
                      )}
                      {usernameAvailable === false && registerUsername.length >= 3 && (
                        <p className="text-xs text-red-600">Username is already taken</p>
                      )}
                      {usernameAvailable === true && (
                        <p className="text-xs text-green-600">Username is available</p>
                      )}
                      {registerUsername.length > 0 && registerUsername.length < 3 && (
                        <p className="text-xs text-muted-foreground">
                          Username must be at least 3 characters
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password *</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Enter your password"
                        value={registerPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        disabled={loading}
                      />
                      {registerPassword.length > 0 && passwordErrors.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">Password must contain:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {passwordErrors.map((error, index) => (
                              <li key={index} className="text-red-600">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {registerPassword.length > 0 && passwordErrors.length === 0 && (
                        <p className="text-xs text-green-600">✓ Password meets all requirements</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password *</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      {registerConfirmPassword &&
                        registerPassword !== registerConfirmPassword && (
                          <p className="text-xs text-red-600">Passwords don't match</p>
                        )}
                      {registerConfirmPassword &&
                        registerPassword === registerConfirmPassword &&
                        passwordErrors.length === 0 && (
                          <p className="text-xs text-green-600">✓ Passwords match</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || usernameAvailable === false || passwordErrors.length > 0}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Account Linking Confirmation Dialog */}
      <AlertDialog open={showLinkingDialog} onOpenChange={setShowLinkingDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Link Your Accounts?</AlertDialogTitle>
            <AlertDialogDescription>
              This email ({linkingInfo?.email}) is already associated with a Google account ({linkingInfo?.name}).
              <br /><br />
              Would you like to link your accounts? After linking, you'll be able to sign in with either:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Your Google account</li>
                <li>Your username and password</li>
              </ul>
              <br />
              Both methods will access the same account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLinkingDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLinking}>
              Yes, Link Accounts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
