import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MainTemplate } from '../templates';
import { 
  StatsPanel, 
  FilterPanel, 
  ReportCard, 
  Modal, 
  EmptyState,
  NewReportForm
} from '../organisms';
import LandingPage from './LandingPage';
import { useReports } from '../hooks';

const formatPhoneNumber = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

export function HomePage() {
  const {
    reports,
    filteredReports,
    stats,
    filterUrgency,
    setFilterUrgency,
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    addReport,
    updateReport,
    deleteReport,
    toggleParticipation,
    addChatMessage,
    addHelpOffer,
    removeHelpOffer,
  } = useReports();

  const [showNewReportForm, setShowNewReportForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    urgency: 'medium',
    image: '',
    multirao: false,
  });
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [helpFormData, setHelpFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [helpErrors, setHelpErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [chatReportId, setChatReportId] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const chatReport = reports.find((report) => report.id === chatReportId);
  const myReports = reports.filter((report) => report.author === 'Você');
  const filteredMyReports = myReports.filter((report) => {
    // Para "Meus reports", apenas aplicar filtro de busca (searchTerm)
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const displayedReports = activeTab === 'myReports' ? filteredMyReports : filteredReports;

  const handleNavigate = (tab) => setActiveTab(tab);

  const handleStatsFilter = (filter) => {
    if (filter === 'myReports') {
      setActiveTab('myReports');
      return;
    }

    setActiveTab('home');
    setFilterStatus(filter);
  };

  const handleFormChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.location.trim()) newErrors.location = 'Localização é obrigatória';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.image.trim()) newErrors.image = 'Foto é obrigatória';
    return newErrors;
  };

  const handleSubmitReport = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingId) {
      updateReport(editingId, formData);
    } else {
      addReport(formData);
    }

    setEditingId(null);
    setFormData({ title: '', location: '', description: '', urgency: 'medium', image: '', multirao: false });
    setErrors({});
    setShowNewReportForm(false);
  };

  const handleEdit = (report) => {
    setEditingId(report.id);
    setFormData({
      title: report.title || '',
      location: report.location || '',
      description: report.description || '',
      urgency: report.urgency || 'medium',
      image: report.image || '',
      multirao: report.multirao ?? false,
    });
    setShowNewReportForm(true);
  };

  const handleStatusChange = (report, targetStatus) => {
    if (targetStatus === 'resolved') {
      updateReport(report.id, {
        previousStatus: report.status,
        status: 'resolved',
      });
      return;
    }

    if (targetStatus === 'reopen' && report.status === 'resolved') {
      updateReport(report.id, {
        status: report.previousStatus || 'pending',
        previousStatus: null,
      });
      return;
    }

    updateReport(report.id, {
      status: targetStatus,
    });
  };

  const handleOpenChat = (id) => {
    setChatReportId(id);
  };

  const handleOpenHelpForm = (id) => {
    const report = reports.find((r) => r.id === id);
    if (report?.myParticipation?.helping) {
      // Se já está ajudando, remover a ajuda
      removeHelpOffer(id);
      toast.success('Sua oferta de ajuda foi removida');
      return;
    }
    // Senão, abrir o formulário para adicionar ajuda
    setChatReportId(id);
    setShowHelpForm(true);
  };

  const handleCloseChat = () => {
    setChatReportId(null);
    setChatMessage('');
    setShowHelpForm(false);
    setHelpFormData({ name: '', phone: '', message: '' });
    setHelpErrors({});
  };

  const validateHelpForm = () => {
    const newErrors = {};
    if (!helpFormData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!helpFormData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    return newErrors;
  };

  const handleSendChatMessage = () => {
    if (!chatReportId || !chatMessage.trim()) return;

    addChatMessage(chatReportId, chatMessage.trim());
    setChatMessage('');
  };

  const handleHelpFormSubmit = () => {
    const newErrors = validateHelpForm();
    if (Object.keys(newErrors).length > 0) {
      setHelpErrors(newErrors);
      return;
    }

    if (!chatReportId) return;

    addHelpOffer(chatReportId, {
      name: helpFormData.name.trim(),
      phone: helpFormData.phone.trim(),
      message: helpFormData.message.trim(),
    });

    setShowHelpForm(false);
    setHelpFormData({ name: '', phone: '', message: '' });
    setHelpErrors({});
    toast.success('Sua oferta de ajuda foi registrada!');
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Remover este report?');
    if (!confirmed) return;

    deleteReport(id);
    toast.success('Report removido com sucesso');
  };

  const closeNewReportModal = () => {
    setShowNewReportForm(false);
    setEditingId(null);
    setFormData({ title: '', location: '', description: '', urgency: 'medium', image: '' });
    setErrors({});
  };

  return (
    <MainTemplate
      onNewReportClick={() => setShowNewReportForm(true)}
      activeTab={activeTab}
      onNavigate={handleNavigate}
    >
      {/* Show stats on all tabs */}
      <StatsPanel stats={stats} myReports={myReports.length} onFilterStatus={handleStatsFilter} />

      <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'myReports' && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Meus reportes</h2>
              <p className="text-sm text-slate-500 mt-2">Edite ou exclua seus reportes abaixo.</p>
            </div>
          )}

          {activeTab === 'myData' ? (
            <div className="glass-panel p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Perfil</h2>
              <div className="grid gap-4 text-slate-700">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500 mb-2">Nome</p>
                  <p className="text-lg font-semibold">Usuário Exemplo</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500 mb-2">Email</p>
                  <p className="text-lg font-semibold">usuario@exemplo.com</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500 mb-2">Cidade</p>
                  <p className="text-lg font-semibold">Florianópolis</p>
                </div>
              </div>
            </div>
          ) : activeTab === 'works' ? (
            <LandingPage />
          ) : (
            <>
              {activeTab === 'home' && (
                <FilterPanel
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filterUrgency={filterUrgency}
                  onUrgencyChange={setFilterUrgency}
                  filterStatus={filterStatus}
                  onStatusChange={setFilterStatus}
                />
              )}

              {displayedReports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {displayedReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onEdit={() => handleEdit(report)}
                      onDelete={() => handleDelete(report.id)}
                      onOpenChat={() => handleOpenChat(report.id)}
                      onOpenHelpForm={() => handleOpenHelpForm(report.id)}
                      onStatusChange={(status) => handleStatusChange(report, status)}
                      showActions={activeTab === 'myReports'}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState onNewReportClick={() => setShowNewReportForm(true)} />
              )}
            </>
          )}
        
      </div>

      {chatReport && !showHelpForm && (
        <Modal
          isOpen={Boolean(chatReport)}
          onClose={handleCloseChat}
          title={`Chat: ${chatReport.title}`}
          onSubmit={handleSendChatMessage}
          submitLabel="Enviar mensagem"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              {chatReport.multirao && (
                <span className="rounded-full bg-slate-100 px-3 py-1">{chatReport.participants} participando</span>
              )}
              <span className="rounded-full bg-slate-100 px-3 py-1">{chatReport.helpers} ajudando</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{chatReport.chat.length} mensagens</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {chatReport.multirao && (
                <button
                  type="button"
                  onClick={() => toggleParticipation(chatReport.id, 'participating')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${chatReport.myParticipation?.participating ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {chatReport.myParticipation?.participating ? 'Você vai participar' : 'Vou participar'}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenHelpForm(chatReport.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${chatReport.myParticipation?.helping ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {chatReport.myParticipation?.helping ? 'Você vai ajudar' : 'Quero ajudar'}
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {chatReport.chat.length > 0 ? (
                chatReport.chat.map((message) => (
                  <div key={message.id} className="rounded-3xl bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>{message.author}</span>
                      <span>{message.date}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{message.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Nenhuma mensagem ainda. Abra o chat e convide pessoas a participar.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nova mensagem</label>
              <textarea
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                placeholder="Escreva sua mensagem..."
                rows={4}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {chatReport.author === 'Você' && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Ofertas de ajuda recebidas</h3>
              {chatReport.helpOffers && chatReport.helpOffers.length > 0 ? (
                <div className="space-y-3">
                  {chatReport.helpOffers.map((offer) => (
                    <div key={offer.id} className="rounded-3xl bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-2 text-sm text-slate-700">
                        <div><strong>Nome:</strong> {offer.name}</div>
                        <div><strong>Telefone:</strong> {offer.phone}</div>
                        {offer.message && <div><strong>Mensagem:</strong> {offer.message}</div>}
                        <div className="text-xs text-slate-500">{offer.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Nenhuma oferta de ajuda registrada ainda.</p>
              )}
            </div>
          )}
        </Modal>
      )}

      {chatReport && showHelpForm && (
        <Modal
          isOpen={showHelpForm}
          onClose={handleCloseChat}
          title={`Quero ajudar: ${chatReport.title}`}
          onSubmit={handleHelpFormSubmit}
          submitLabel="Enviar oferta"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome</label>
              <input
                type="text"
                value={helpFormData.name}
                onChange={(e) => setHelpFormData({ ...helpFormData, name: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Seu nome"
              />
              {helpErrors.name && <p className="text-red-500 text-sm mt-1">{helpErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Telefone</label>
              <input
                type="tel"
                value={helpFormData.phone}
                onChange={(e) => setHelpFormData({ ...helpFormData, phone: formatPhoneNumber(e.target.value) })}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="(xx) xxxxx-xxxx"
              />
              {helpErrors.phone && <p className="text-red-500 text-sm mt-1">{helpErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Como posso ajudar</label>
              <textarea
                value={helpFormData.message}
                onChange={(e) => setHelpFormData({ ...helpFormData, message: e.target.value })}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Descreva como deseja ajudar, horários e outras informações relevantes"
              />
            </div>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={showNewReportForm}
        onClose={closeNewReportModal}
        title={editingId ? 'Editar report' : 'Reportar área poluída'}
        onSubmit={handleSubmitReport}
        submitLabel={editingId ? 'Salvar' : 'Enviar Report'}
      >
        <NewReportForm
          formData={formData}
          onFormChange={handleFormChange}
          errors={errors}
        />
      </Modal>
    </MainTemplate>
  );
}
