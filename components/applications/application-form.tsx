'use client';

import { FormEvent, useState } from 'react';
import { Loader2, X, BriefcaseBusiness, MapPin, Link2, DollarSign, Calendar, FileText, Tag } from 'lucide-react';

import {
  useCreateApplication,
} from '@/hooks/use-applications';

interface ApplicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ApplicationForm({
  onSuccess,
  onCancel,
}: ApplicationFormProps) {
  const createApplication = useCreateApplication();

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [status, setStatus] = useState('APPLIED');
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    // ----------------------------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------------------------

    if (!company.trim()) {
      setError('Company is required.');
      return;
    }

    if (!position.trim()) {
      setError('Position is required.');
      return;
    }

    // ----------------------------------------------------------
    // SALARY
    // ----------------------------------------------------------

    const minSalary = salaryMin.trim() === '' ? undefined : Number(salaryMin);
    const maxSalary = salaryMax.trim() === '' ? undefined : Number(salaryMax);

    // ----------------------------------------------------------
    // SALARY VALIDATION
    // ----------------------------------------------------------

    if (minSalary !== undefined && (!Number.isFinite(minSalary) || minSalary < 0)) {
      setError('Minimum salary must be a valid number greater than or equal to 0.');
      return;
    }

    if (maxSalary !== undefined && (!Number.isFinite(maxSalary) || maxSalary < 0)) {
      setError('Maximum salary must be a valid number greater than or equal to 0.');
      return;
    }

    if (minSalary !== undefined && maxSalary !== undefined && minSalary > maxSalary) {
      setError('Minimum salary cannot be greater than maximum salary.');
      return;
    }

    // ----------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------

    try {
      await createApplication.mutateAsync({
        company: company.trim(),
        position: position.trim(),
        jobUrl: jobUrl.trim() || undefined,
        location: location.trim() || undefined,
        salaryMin: minSalary,
        salaryMax: maxSalary,
        currency: 'INR',
        jobType,
        status,
        appliedDate,
        deadline: deadline || undefined,
        description: description.trim() || undefined,
      });

      onSuccess();
    } catch (error: any) {
      const message = error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Unable to create application.',
      );
    }
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200/80">
        {/* HEADER */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200/80 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
              <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add Application
              </h2>
              <p className="text-sm text-gray-500">
                Track a new job application
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={createApplication.isPending}
            className="rounded-xl p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* FIELDS */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Company *"
              value={company}
              onChange={setCompany}
              placeholder="Google"
              icon={BriefcaseBusiness}
              required
            />

            <Field
              label="Position *"
              value={position}
              onChange={setPosition}
              placeholder="Software Engineer"
              icon={Tag}
              required
            />

            <Field
              label="Job URL"
              value={jobUrl}
              onChange={setJobUrl}
              placeholder="https://..."
              type="url"
              icon={Link2}
            />

            <Field
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="Bangalore / Remote"
              icon={MapPin}
            />

            <Field
              label="Minimum Salary"
              value={salaryMin}
              onChange={setSalaryMin}
              placeholder="500000"
              type="number"
              min="0"
              icon={DollarSign}
            />

            <Field
              label="Maximum Salary"
              value={salaryMax}
              onChange={setSalaryMax}
              placeholder="800000"
              type="number"
              min="0"
              icon={DollarSign}
            />

            {/* JOB TYPE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300"
              >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            <Field
              label="Applied Date *"
              value={appliedDate}
              onChange={setAppliedDate}
              type="date"
              icon={Calendar}
              required
            />

            <Field
              label="Deadline"
              value={deadline}
              onChange={setDeadline}
              type="date"
              icon={Calendar}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                maxLength={10000}
                placeholder="Notes about this job..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white/50 pl-11 pr-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="mt-1.5 text-right text-xs text-gray-400">
              {description.length}/10000 characters
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 border-t border-gray-200/80 pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={createApplication.isPending}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createApplication.isPending}
              className="relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center gap-2">
                {createApplication.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {createApplication.isPending ? 'Saving...' : 'Add Application'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// FIELD
// ============================================================

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
  icon: Icon,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600" />
        )}
        <input
          type={type}
          value={value}
          required={required}
          min={min}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl border border-gray-200 bg-white/50 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4`}
        />
      </div>
    </div>
  );
}