import {
  forwardRef,
  type ForwardedRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'

const FIELD_BASE = 'font-sans text-[0.98rem] text-ink w-full py-[0.8em] px-[1em] border border-hairline-2 rounded-md bg-surface transition-[border-color,box-shadow] duration-200 placeholder:text-ink-muted focus:outline-none focus:border-[var(--teal)] focus:shadow-[var(--ring)]'

interface BaseFieldProps {
  id: string
  label: string
  error?: string
  className?: string
  fullWidth?: boolean
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  as?: 'input'
}

interface TextareaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  as: 'textarea'
}

interface SelectFieldProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  as: 'select'
  children: React.ReactNode
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(function FormField(props, ref) {
  const { id, label, error, className = '', fullWidth = false, as = 'input', ...rest } = props

  const wrapperCls = `flex flex-col gap-[7px] ${fullWidth ? 'col-span-full' : ''} ${className}`
  const labelCls = 'text-[0.82rem] font-semibold text-ink-soft tracking-[0.01em]'

  return (
    <div className={wrapperCls}>
      <label htmlFor={id} className={labelCls}>
        {label}{props.required && <span aria-hidden="true" className="text-[var(--accent-ink)] ml-0.5">*</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={id}
          ref={ref as ForwardedRef<HTMLTextAreaElement>}
          className={`${FIELD_BASE} resize-y min-h-[130px]`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === 'select' ? (
        (() => {
          const { children: opts, ...selectRest } = rest as SelectFieldProps
          return (
            <select
              id={id}
              ref={ref as ForwardedRef<HTMLSelectElement>}
              className={FIELD_BASE}
              {...(selectRest as SelectHTMLAttributes<HTMLSelectElement>)}
            >
              {opts}
            </select>
          )
        })()
      ) : (
        <input
          id={id}
          ref={ref as ForwardedRef<HTMLInputElement>}
          className={FIELD_BASE}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="text-[0.82rem] text-red-600" role="alert">{error}</p>}
    </div>
  )
})
