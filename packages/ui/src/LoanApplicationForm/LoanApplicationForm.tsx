import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

// --- App-agnostic logic block -------------------------------------------------
// This component owns ALL the form logic: field state, validation rules, and
// submit handling. It knows nothing about any brand. Brands only pass in an
// accent color (theming) and a submit handler (behavior).

export interface LoanApplication {
  fullName: string;
  email: string;
  amount: number;
}

export interface LoanApplicationFormProps {
  /** Brand accent color applied to the focused field + submit button. */
  accentColor?: string;
  /** Called with the validated payload when the form passes validation. */
  onSubmit?: (application: LoanApplication) => void;
}

type Errors = Partial<Record<'fullName' | 'email' | 'amount', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 100_000;

function validate(fullName: string, email: string, amount: string): Errors {
  const errors: Errors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  const numeric = Number(amount);
  if (!amount.trim()) {
    errors.amount = 'Loan amount is required.';
  } else if (Number.isNaN(numeric)) {
    errors.amount = 'Amount must be a number.';
  } else if (numeric < MIN_AMOUNT || numeric > MAX_AMOUNT) {
    errors.amount = `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}.`;
  }

  return errors;
}

export function LoanApplicationForm({
  accentColor = '#2563eb',
  onSubmit,
}: LoanApplicationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [focused, setFocused] = useState<string | null>(null);

  function handleSubmit() {
    const nextErrors = validate(fullName, email, amount);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const application: LoanApplication = {
      fullName: fullName.trim(),
      email: email.trim(),
      amount: Number(amount),
    };

    if (onSubmit) {
      onSubmit(application);
    } else {
      Alert.alert('Application submitted', JSON.stringify(application, null, 2));
    }
  }

  const field = (
    key: 'fullName' | 'email' | 'amount',
    label: string,
    value: string,
    onChange: (text: string) => void,
    extra?: object,
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(key)}
        onBlur={() => setFocused(null)}
        style={[
          styles.input,
          focused === key && { borderColor: accentColor },
          errors[key] != null && styles.inputError,
        ]}
        {...extra}
      />
      {errors[key] != null && <Text style={styles.error}>{errors[key]}</Text>}
    </View>
  );

  return (
    <View style={styles.form}>
      {field('fullName', 'Full name', fullName, setFullName, {
        placeholder: 'Jane Doe',
        autoCapitalize: 'words',
      })}
      {field('email', 'Email', email, setEmail, {
        placeholder: 'jane@example.com',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}
      {field('amount', 'Loan amount', amount, setAmount, {
        placeholder: '5000',
        keyboardType: 'numeric',
      })}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: accentColor }]}
        onPress={handleSubmit}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}
