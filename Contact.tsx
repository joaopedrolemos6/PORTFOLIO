import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from './api';

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

const initialState: ContactFormState = {
  name: '',
  email: '',
  message: '',
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Preencha todos os campos para enviar sua mensagem.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = (errorData as { message?: string }).message ?? 'Não foi possível enviar sua mensagem.';
        throw new Error(errorMessage);
      }

      const result = (await response.json().catch(() => ({}))) as { message?: string };
      const successMessage = result.message ?? 'Mensagem enviada com sucesso! Em breve entrarei em contato.';
      toast.success(successMessage);
      setForm(initialState);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar sua mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-stone-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">Vamos Conversar</h2>
          <p className="mt-4 text-lg text-stone-600 dark:text-stone-300">
            Tem um projeto em mente ou quer saber mais sobre meu trabalho? Envie uma mensagem e responderei o mais breve possível.
          </p>
        </div>

        <div className="bg-sand-50 dark:bg-stone-900 border border-sand-200 dark:border-stone-800 rounded-2xl shadow-lg p-8 md:p-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/80 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                placeholder="Como posso te chamar?"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/80 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                placeholder="nome@empresa.com"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/80 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                placeholder="Conte-me mais sobre o desafio ou ideia que você tem em mente."
                rows={6}
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary w-full sm:w-auto"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
