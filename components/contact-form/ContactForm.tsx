import { useState } from 'react';
import Style from './ContactForm.module.scss';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type Props = { singleColumn?: boolean; serviceNames?: string[] };

export function ContactForm({ singleColumn, serviceNames }: Props = {}) {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as any).toString(),
      });
      if (!res.ok) throw new Error(`Form submission failed: ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={Style.success}>
        <p>Thanks! We&apos;ll be in touch within one business day.</p>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
      className={Style.form}
    >
      <input type="hidden" name="form-name" value="contact" />

      <div className={singleColumn ? `${Style.row} ${Style.rowSingle}` : Style.row}>
        <label className={Style.field}>
          <span>Name <span aria-hidden="true" className={Style.required}>*</span></span>
          <input type="text" name="name" required autoComplete="name" />
        </label>
        <label className={Style.field}>
          <span>Email <span aria-hidden="true" className={Style.required}>*</span></span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
      </div>

      <div className={singleColumn ? `${Style.row} ${Style.rowSingle}` : Style.row}>
        <label className={Style.field}>
          <span>Phone</span>
          <input type="tel" name="phone" autoComplete="tel" />
        </label>
        <label className={Style.field}>
          <span>Type of project</span>
          <select name="project_type">
            <option value="">Select one…</option>
            {(serviceNames ?? []).map((name) => (
              <option key={name}>{name}</option>
            ))}
            <option>Other</option>
          </select>
        </label>
      </div>

      <label className={`${Style.field} ${Style.full}`}>
        <span>Tell us about your project</span>
        <textarea name="description" rows={5} />
      </label>

      <label className={`${Style.field} ${Style.full}`}>
        <span>Best time to call</span>
        <input type="text" name="best_time" placeholder="e.g. weekday mornings" />
      </label>

      {status === 'error' && (
        <p className={Style.errorMsg}>Something went wrong. Please email us directly.</p>
      )}

      <button type="submit" className={Style.submit} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
