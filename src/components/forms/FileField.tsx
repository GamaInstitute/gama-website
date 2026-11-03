import { useTranslation } from 'react-i18next'

interface FileFieldProps {
  id: string
  label: string
  accept: string
  file: File | null
  onChange: (file: File | null) => void
  hint?: React.ReactNode
  error?: string
  required?: boolean
}

// Styled file picker: the native input stays focusable but visually hidden,
// the whole dashed box is its <label>.
export function FileField({ id, label, accept, file, onChange, hint, error, required }: FileFieldProps) {
  const { t } = useTranslation('common')
  return (
    <div className="flex flex-col gap-[7px] col-span-full">
      <span className="text-[0.82rem] font-semibold text-ink-soft tracking-[0.01em]" id={`${id}-lbl`}>
        {label}{required && <span aria-hidden="true" className="text-[var(--accent-ink)] ml-0.5">*</span>}
      </span>
      <label
        htmlFor={id}
        className="relative flex items-center gap-3 border border-dashed border-hairline-2 rounded-md p-2.5 bg-bg-alt cursor-pointer transition-colors duration-200 hover:border-ink focus-within:border-[var(--teal)] focus-within:shadow-[var(--ring)]"
      >
        <input
          id={id}
          type="file"
          accept={accept}
          aria-labelledby={`${id}-lbl`}
          aria-invalid={!!error}
          required={required}
          className="absolute w-px h-px opacity-0"
          onChange={e => onChange(e.target.files?.[0] ?? null)}
        />
        <span className="flex-none text-[0.85rem] font-semibold text-ink bg-surface border border-hairline-2 rounded-pill py-[0.45em] px-[1em]">
          {t('forms.choose_file')}
        </span>
        <span className={`text-[0.88rem] overflow-hidden text-ellipsis whitespace-nowrap min-w-0 ${file ? 'text-ink font-medium' : 'text-ink-muted'}`}>
          {file ? file.name : t('forms.no_file')}
        </span>
      </label>
      {hint && <small className="block text-[0.78rem] text-ink-muted">{hint}</small>}
      {error && <p className="text-[0.82rem] text-red-600" role="alert">{error}</p>}
    </div>
  )
}
