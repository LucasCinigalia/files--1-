import { useState, useEffect } from 'react';
import { mockReports, mockReportsVersion } from '../../mockData.js';

export function useReports() {
  const storedVersion = typeof window !== 'undefined' ? window.localStorage.getItem('reportsVersion') : null;
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('reports') : null;

  const normalizeReport = (report) => ({
    participants: 0,
    helpers: 0,
    helpOffers: [],
    chat: [],
    myParticipation: { participating: false, helping: false },
    multirao: false,
    ...report,
  });

  const initial = (() => {
    if (storedVersion !== mockReportsVersion) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('reports');
        window.localStorage.setItem('reportsVersion', mockReportsVersion);
      }
      return mockReports.map(normalizeReport);
    }

    if (!stored) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('reportsVersion', mockReportsVersion);
      }
      return mockReports.map(normalizeReport);
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(normalizeReport) : mockReports.map(normalizeReport);
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('reports');
        window.localStorage.setItem('reportsVersion', mockReportsVersion);
      }
      return mockReports.map(normalizeReport);
    }
  })();

  const [reports, setReports] = useState(initial);
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter((report) => {
    const matchesUrgency = filterUrgency === 'all' || report.urgency === filterUrgency;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUrgency && matchesStatus && matchesSearch;
  });

  const stats = {
    total: reports.length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    inProgress: reports.filter((r) => r.status === 'in-progress').length,
  };

  const addReport = (newReportData) => {
    const newReport = {
      id: Date.now(),
      ...newReportData,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      image: newReportData.image || 'https://images.unsplash.com/photo-1559020615-cd4628902d4a?w=400&h=300&fit=crop',
      author: 'Você',
      participants: 0,
      helpers: 0,
      helpOffers: [],
      chat: [],
      myParticipation: { participating: false, helping: false },
      multirao: newReportData.multirao ?? false,
    };
    setReports((currentReports) => [newReport, ...currentReports]);
    return newReport;
  };

  const updateReport = (id, updatedData) => {
    setReports((currentReports) =>
      currentReports.map((r) => {
        if (r.id !== id) return r;
        if (updatedData.previousStatus === null) {
          const { previousStatus, ...rest } = { ...r, ...updatedData };
          return rest;
        }
        return { ...r, ...updatedData };
      })
    );
  };

  const deleteReport = (id) => {
    setReports((currentReports) => currentReports.filter((r) => r.id !== id));
  };

  const toggleParticipation = (id, type) => {
    setReports((currentReports) =>
      currentReports.map((r) => {
        if (r.id !== id) return r;
        const already = r.myParticipation?.[type] ?? false;
        const countKey = type === 'participating' ? 'participants' : 'helpers';
        return {
          ...r,
          [countKey]: Math.max(0, (r[countKey] ?? 0) + (already ? -1 : 1)),
          myParticipation: {
            ...r.myParticipation,
            [type]: !already,
          },
        };
      })
    );
  };

  const addChatMessage = (id, text) => {
    const message = {
      id: Date.now(),
      author: 'Você',
      text,
      date: new Date().toLocaleString(),
    };
    setReports((currentReports) =>
      currentReports.map((r) =>
        r.id === id ? { ...r, chat: [...r.chat, message] } : r
      )
    );
  };

  const addHelpOffer = (id, offer) => {
    const helpEntry = {
      id: Date.now(),
      ...offer,
      date: new Date().toLocaleString(),
    };

    setReports((currentReports) =>
      currentReports.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          helpers: Math.max(0, (r.helpers ?? 0) + 1),
          helpOffers: [...(r.helpOffers ?? []), helpEntry],
          myParticipation: {
            ...r.myParticipation,
            helping: true,
          },
        };
      })
    );
  };

  const removeHelpOffer = (id) => {
    setReports((currentReports) =>
      currentReports.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          helpers: Math.max(0, (r.helpers ?? 0) - 1),
          helpOffers: (r.helpOffers ?? []).slice(0, -1), // Remove o último oferecimento
          myParticipation: {
            ...r.myParticipation,
            helping: false,
          },
        };
      })
    );
  };

  // persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('reports', JSON.stringify(reports));
      }
    } catch (e) {
      // ignore
    }
  }, [reports]);

  return {
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
  };
}
