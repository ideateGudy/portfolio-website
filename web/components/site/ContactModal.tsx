'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MailIcon, CheckIcon } from '@/components/ui/icons';
import { useUIStore } from '@/store/ui';


interface ContactModalProps {
  recipientEmail?: string;
}

export function ContactModal({ recipientEmail = 'azonubigoodnews@gmail.com' }: ContactModalProps) {
  const open = useUIStore((s) => s.contactModalOpen);
  const close = useUIStore((s) => s.closeContactModal);
  const defaultSubject = useUIStore((s) => s.contactModalSubject);
  const toast = useUIStore((s) => s.toast);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Track previous open state to update form when dialog opens without triggering cascading setState in an effect
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    setPrevOpen(true);
    setForm((prev) => ({
      ...prev,
      subject: defaultSubject ? `Project Inquiry: ${defaultSubject}` : prev.subject,
    }));
    setStatus('idle');
    setErrorMessage('');
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  const accessKey =
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || `New Portfolio Inquiry from ${form.name.trim()}`,
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        toast('Message sent successfully! I will get back to you shortly.');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        // Fallback to client mailto
        fallbackMailto(data.message || 'Submission error');
      }
    } catch {
      fallbackMailto('Network error');
    }
  };

  const fallbackMailto = (reason: string) => {
    const subjectEnc = encodeURIComponent(
      form.subject.trim() || `Portfolio Inquiry from ${form.name.trim() || 'Client'}`
    );
    const bodyEnc = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${recipientEmail}?subject=${subjectEnc}&body=${bodyEnc}`;
    setStatus('success');
    toast(`Form submission could not reach API (${reason}). Opened mail draft!`);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Get in touch"
      description="Have a project in mind, need backend & DevOps expertise, or want to discuss fullstack architecture? Send me a message below."
      maxWidth="max-w-lg"
    >
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent">
            <CheckIcon size={28} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-fg">Message Received!</h3>
          <p className="mt-2 text-sm text-muted">
            Thank you for reaching out. I have received your message and will review it and reply as soon as possible.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setStatus('idle');
                close();
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setStatus('idle');
              }}
            >
              Send another message
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Your name *"
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="e.g. Alex Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={status === 'submitting'}
            />
            <Input
              label="Your email *"
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="alex@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={status === 'submitting'}
            />
          </div>

          <Input
            label="Subject (optional)"
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="e.g. Backend architecture consultation"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            disabled={status === 'submitting'}
          />

          <Textarea
            label="Message *"
            id="contact-message"
            name="message"
            rows={4}
            required
            placeholder="Tell me about your project, timeline, scope, or questions…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            disabled={status === 'submitting'}
          />

          {errorMessage && (
            <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
          )}

          <div className="mt-2 flex flex-col-reverse gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={close}
                disabled={status === 'submitting'}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={status === 'submitting'}
                className="w-full gap-2 sm:w-auto"
              >
                <MailIcon size={16} />
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Dialog>
  );
}

