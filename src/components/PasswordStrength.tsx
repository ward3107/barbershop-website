// Password strength indicator component
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  show: boolean;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function validatePassword(password: string): {
  isValid: boolean;
  requirements: PasswordRequirement[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} {
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(password)
    },
    {
      label: 'Contains number',
      met: /[0-9]/.test(password)
    },
    {
      label: 'Contains special character (!@#$%^&*)',
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
  ];

  const metCount = requirements.filter(r => r.met).length;
  const isValid = metCount >= 4 && password.length >= 8;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (metCount >= 5 && password.length >= 12) {
    strength = 'strong';
  } else if (metCount >= 4 && password.length >= 8) {
    strength = 'medium';
  }

  return {
    isValid,
    requirements,
    strength,
    score: metCount
  };
}

export default function PasswordStrength({ password, show }: PasswordStrengthProps) {
  if (!show || password.length === 0) return null;

  const { requirements, strength, score } = validatePassword(password);

  const getStrengthColor = () => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'strong': return { text: 'Strong', color: 'text-green-500' };
      case 'medium': return { text: 'Medium', color: 'text-yellow-500' };
      default: return { text: 'Weak', color: 'text-red-500' };
    }
  };

  const strengthInfo = getStrengthText();

  return (
    <div className="mt-3 space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Password Strength:</span>
          <span className={`text-xs font-bold ${strengthInfo.color}`}>
            {strengthInfo.text}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-gray-500 flex-shrink-0" />
            )}
            <span className={req.met ? 'text-green-400' : 'text-gray-500'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      {strength === 'weak' && (
        <p className="text-xs text-yellow-400 mt-2">
          💡 Tip: Use a mix of uppercase, lowercase, numbers, and symbols for a strong password
        </p>
      )}
    </div>
  );
}
