import React, { useState, useEffect } from 'react';
import { Heading, Text } from '../atoms';
import { ReportHeader, LocationField, VoteSection } from '../molecules';
import { Modal } from './Modal';

export function ReportCard({ report, onEdit, onDelete, onOpenChat, onOpenHelpForm, onStatusChange, showActions = false }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const {
    id,
    title,
    location,
    urgency,
    status,
    date,
    image,
    description,
    author,
    votes,
    participants = 0,
    helpers = 0,
    chat = [],
    multirao = false,
  } = report;

  useEffect(() => {
    const handler = (e) => {
      setShowImageModal(e.detail === id);
    };

    window.addEventListener('openImageModal', handler);
    return () => window.removeEventListener('openImageModal', handler);
  }, [id]);

  return (
    <>
      <div
        className={`flex h-full flex-col bg-white rounded-[1.5rem] overflow-hidden shadow-xl border border-slate-200 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl border-l-4 ${
          urgency === 'high' ? 'border-red-200' : urgency === 'medium' ? 'border-yellow-200' : 'border-blue-200'
        }`}
      >
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            onClick={() => window.dispatchEvent(new CustomEvent('openImageModal', { detail: id }))}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <ReportHeader urgency={urgency} status={status} className="mb-3" />

          {multirao && (
            <div className="mb-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
              Multirão confirmado
            </div>
          )}

          <Heading level={3} className="line-clamp-2 mb-2">
            {title}
          </Heading>

          <LocationField location={location} className="mb-3" />

          <Text size="sm" color="slate" className="mb-4 line-clamp-2">
            {description}
          </Text>

          <div className="mt-auto flex flex-col gap-4 pt-3 border-t border-slate-200 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text size="xs" color="dark" weight="medium">
                {author}
              </Text>
              <Text size="xs" color="light">
                {date}
              </Text>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-end">
              <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenChat}
                className="text-sm text-sky-600 hover:underline"
                aria-label="Abrir chat"
              >
                Ver mensagens
              </button>
              <button
                type="button"
                onClick={onOpenHelpForm}
                className="text-sm text-blue-600 hover:underline"
                aria-label="Quero ajudar"
              >
                Quero ajudar
              </button>
              {showActions && (
                <>
                  <button onClick={onEdit} className="text-sm text-sky-600 hover:underline" aria-label="Editar">
                    Editar
                  </button>
                  <button onClick={onDelete} className="text-sm text-red-600 hover:underline" aria-label="Remover">
                    Remover
                  </button>
                  {status === 'pending' ? (
                    <button
                      onClick={() => onStatusChange('in-progress')}
                      className="text-sm text-amber-600 hover:underline"
                      aria-label="Marcar como em andamento"
                    >
                      Em andamento
                    </button>
                  ) : (
                    <button
                      onClick={() => onStatusChange('pending')}
                      className="text-sm text-slate-600 hover:underline"
                      aria-label="Voltar para pendente"
                    >
                      Voltar para pendente
                    </button>
                  )}
                  <button
                    onClick={() => onStatusChange('resolved')}
                    className="text-sm text-emerald-600 hover:underline"
                    aria-label="Marcar como resolvido"
                  >
                    Marcar resolvido
                  </button>
                </>
              )}
            </div>

              <div className="space-y-3 text-right">
                <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-slate-500">
                  {multirao && (
                    <span className="rounded-full bg-slate-100 px-3 py-1">{participants} participando</span>
                  )}
                  <span className="rounded-full bg-slate-100 px-3 py-1">{helpers} ajudando</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{chat.length} mensagens</span>
                </div>
                <VoteSection votes={votes} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title={title}
        onSubmit={() => setShowImageModal(false)}
        submitLabel="Fechar"
        zIndex={1200}
      >
        <div className="flex justify-center items-center">
          <img src={image} alt={title} className="max-h-[80vh] w-auto object-contain rounded-md" />
        </div>
      </Modal>
    </>
  );
}
