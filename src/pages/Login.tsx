
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Car, LogIn, UserPlus, KeyRound } from 'lucide-react';

const Login = () => {
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  if (user && !loading) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || password !== confirmPassword) return;
    
    try {
      setIsSubmitting(true);
      await signUp(email, password);
      setActiveTab('login');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setIsSubmitting(true);
      await resetPassword(email);
      setPasswordResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Cons Road</h1>
          </div>
        </div>
        
        <Card className="shadow-lg glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">System Zarządzania Flotą</CardTitle>
            <CardDescription className="text-center">
              Zaloguj się lub utwórz konto, aby zarządzać flotą pojazdów
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="login">Logowanie</TabsTrigger>
              <TabsTrigger value="register">Rejestracja</TabsTrigger>
              <TabsTrigger value="reset">Reset hasła</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="adres@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Hasło</Label>
                    <Input
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? 'Logowanie...' : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Zaloguj się
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="adres@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Hasło</Label>
                    <Input
                      id="password-register"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Potwierdź hasło</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || loading || password !== confirmPassword}
                  >
                    {isSubmitting ? 'Rejestracja...' : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Zarejestruj się
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="reset">
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-4">
                  {passwordResetSent ? (
                    <div className="p-4 bg-green-100 text-green-800 rounded-md">
                      Link do resetowania hasła został wysłany na podany adres email.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="email-reset">Email</Label>
                      <Input
                        id="email-reset"
                        type="email"
                        placeholder="adres@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {!passwordResetSent && (
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting ? 'Wysyłanie...' : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Resetuj hasło
                        </>
                      )}
                    </Button>
                  )}
                  {passwordResetSent && (
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full" 
                      onClick={() => {
                        setActiveTab('login');
                        setPasswordResetSent(false);
                      }}
                    >
                      Wróć do logowania
                    </Button>
                  )}
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
