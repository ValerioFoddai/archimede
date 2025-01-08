import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { supabase } from '@/lib/supabase';
import { AuthCard } from './auth-card';
import { AuthDivider } from './auth-divider';
import { SocialButton } from './social-button';

export function LoginForm() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(data.email, data.password);
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else if (err.message.includes('rate limit')) {
          setError('Too many login attempts. Please try again later.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        {/* Google Sign In temporarily removed
        <SocialButton
          onClick={handleGoogleSignIn}
          icon={<img src="/google.svg" alt="Google" className="w-5 h-5" />}
        >
          Sign in with Google
        </SocialButton>

        <AuthDivider />
        */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      autoComplete="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      autoComplete="current-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
