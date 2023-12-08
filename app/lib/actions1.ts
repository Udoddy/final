'use server';

import { z } from 'zod';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqgwbtprmhgejhyibcdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZ3didHBybWhnZWpoeWliY2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4MjY1NTMsImV4cCI6MjAxNzQwMjU1M30.EmXW51BVGYKlXrw2ggjfwdtdYGb1OLg27ctGOB8UfTM';
const supabase = createSupabaseClient(supabaseUrl, supabaseKey);


import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

// Registration form schema
const RegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  // Add more fields as needed (e.g., full name, username, etc.)
});

// Registration function
// export async function register(formData: FormData) {
//   try {
//     const validatedFields = RegistrationSchema.parse({
//       email: formData.get('email') as string,
//       password: formData.get('password') as string,
//       // Parse additional fields here
//     });
//
//     const {data: user, error } = await supabase.auth.signUp({
//       email: validatedFields.email,
//       password: validatedFields.password,
//       // Additional user registration data can be passed here
//     });
//
//     // if (error) {
//     //   throw new AuthError('RegistrationError', error.message);
//     // }
//
//     // You can return additional information or handle success as needed
//     return { user, message: 'Registration successful!' };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'RegistrationError':
//           return 'Registration failed. ' + error.message;
//         default:
//           console.error('Registration Error:', error);
//           return 'Something went wrong during registration.';
//       }
//     }
//
//     console.error('Unexpected Error:', error);
//     throw error;
//   }
// }

// Define form schema
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// Define form transformations
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

// Define state type
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Authenticate function
export async function authenticate(formData: FormData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });

    // if (error) {
    //   throw new AuthError('CredentialsSignin', error.message);
    // }

    return data?.user;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          console.error('Authentication Error:', error);
          return 'Something went wrong.';
      }
    }

    console.error('Unexpected Error:', error);
    throw error;
  }
}
