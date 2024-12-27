import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const strength = calculateStrength(password);
  
  return (
    <div className="space-y-2">
      <Progress value={strength} className="h-2" />
      <p className="text-sm text-muted-foreground">
        Password strength: {strength === 100 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}
      </p>
    </div>
  );
}