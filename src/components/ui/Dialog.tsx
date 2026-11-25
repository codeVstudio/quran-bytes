import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'

export interface DialogProps {
  id: string
  open: boolean
  onClose: () => void
  labelledBy: string
  closeLabel: string
  className?: string
  children: ReactNode
}

export function Dialog({
  id,
  open,
  onClose,
  labelledBy,
  closeLabel,
  className,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) {
        dialog.showModal()
      }
      document.body.classList.add('dialog-open')
    } else {
      if (dialog.open) {
        dialog.close()
      }
      document.body.classList.remove('dialog-open')
    }

    return () => {
      document.body.classList.remove('dialog-open')
    }
  }, [open])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current
    if (!dialog || event.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className={className}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={handleBackdropClick}
    >
      <button
        className="dialog-close"
        id="close-contribute"
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <span />
        <span />
      </button>
      {children}
    </dialog>
  )
}

export default Dialog
