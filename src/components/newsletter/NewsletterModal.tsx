import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { NewsletterPerks } from '@/components/ui/NewsletterPerks'
import { NewsletterForm } from '@/components/ui/NewsletterForm'

/** The site-wide subscribe window. Lazy-loaded by NewsletterProvider. */
export default function NewsletterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation('common')
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeLabel={t('close')} title={t('newsletter.modal_title')}>
      <NewsletterPerks />
      <NewsletterForm />
    </Modal>
  )
}
