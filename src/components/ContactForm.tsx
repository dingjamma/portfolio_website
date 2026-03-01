import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'loading' | 'success' | 'error';

// ── Replace YOUR_FORM_ID with your actual Formspree form ID ──
// Sign up free at https://formspree.io → create form → copy the ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your full name"
          value={formData.name}
          onChange={handleChange}
          disabled={status === 'loading'}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={status === 'loading'}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project or just say hi…"
          value={formData.message}
          onChange={handleChange}
          disabled={status === 'loading'}
          className="resize-none"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </Button>

      {/* Feedback */}
      {status === 'success' && (
        <div className={cn(
          'flex items-center gap-2 rounded-lg p-4 text-sm',
          'bg-emerald-50 text-emerald-700 border border-emerald-200',
          'dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
        )}>
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Message sent! I'll get back to you soon.</span>
        </div>
      )}

      {status === 'error' && (
        <div className={cn(
          'flex items-center gap-2 rounded-lg p-4 text-sm',
          'bg-red-50 text-red-700 border border-red-200',
          'dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
        )}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Something went wrong. Please email me directly at james@dingjames.com</span>
        </div>
      )}
    </form>
  );
}
