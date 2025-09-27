
import React from 'react';
import { useState } from 'react';
import { View, FamilyMember, HealthMetricRecord, Appointment, CaregiverNote, Vaccination, HealthCheckup, Medication } from './types';
import { NAV_ITEMS }from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FamilyManager from './components/FamilyManager';
import HealthCalendar from './components/HealthCalendar';
import HealthManagement from './components/HealthManagement';
import CaregiverLog from './components/CaregiverLog';
import AiAnalysis from './components/AiAnalysis';
import AiChatbot from './components/AiChatbot';
import MedicationManager from './components/MedicationManager';

// Mock Data
import { MOCK_FAMILY_MEMBERS, MOCK_HEALTH_METRICS, MOCK_APPOINTMENTS, MOCK_CAREGIVER_NOTES, MOCK_VACCINATIONS, MOCK_HEALTH_CHECKUPS, MOCK_MEDICATIONS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(NAV_ITEMS[0].name);

  // State management
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetricRecord[]>(MOCK_HEALTH_METRICS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [caregiverNotes, setCaregiverNotes] = useState<CaregiverNote[]>(MOCK_CAREGIVER_NOTES);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(MOCK_VACCINATIONS);
  const [healthCheckups, setHealthCheckups] = useState<HealthCheckup[]>(MOCK_HEALTH_CHECKUPS);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  
  // Handlers
  const handleAddMember = (member: Omit<FamilyMember, 'id'>, initialWeight?: number) => {
    const newMember: FamilyMember = { ...member, id: `fm-${Date.now()}` };
    setFamilyMembers(prev => [...prev, newMember]);
    if (initialWeight) {
      handleAddHealthMetric({
        familyMemberId: newMember.id,
        type: 'weight',
        value: initialWeight,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    setFamilyMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const handleDeleteMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    // Also delete related data
    setHealthMetrics(prev => prev.filter(m => m.familyMemberId !== id));
    setAppointments(prev => prev.filter(a => a.familyMemberId !== id));
    setCaregiverNotes(prev => prev.filter(n => n.familyMemberId !== id));
    setVaccinations(prev => prev.filter(v => v.familyMemberId !== id));
    setHealthCheckups(prev => prev.filter(c => c.familyMemberId !== id));
    setMedications(prev => prev.filter(med => med.familyMemberId !== id));
  };
  
  const handleAddHealthMetric = (metric: Omit<HealthMetricRecord, 'id'>) => {
    const newMetric: HealthMetricRecord = { ...metric, id: `hm-${Date.now()}` };
    setHealthMetrics(prev => [...prev, newMetric]);
  };
  
  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...appointment, id: `apt-${Date.now()}` };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
  };

  const handleAddNote = (note: Omit<CaregiverNote, 'id' | 'timestamp'>) => {
    const newNote: CaregiverNote = { ...note, id: `cn-${Date.now()}`, timestamp: new Date().toISOString() };
    setCaregiverNotes(prev => [...prev, newNote]);
  };

  const handleDeleteNote = (noteId: string) => {
    setCaregiverNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleUpdateVaccinationStatus = (vaccinationId: string, isCompleted: boolean) => {
    setVaccinations(prev => prev.map(v => v.id === vaccinationId ? { ...v, completed: isCompleted } : v));
  };

  const handleUpdateVaccination = (updatedVaccination: Vaccination) => {
    setVaccinations(prev => prev.map(v => v.id === updatedVaccination.id ? updatedVaccination : v));
  };

  const handleAddCheckup = (checkup: Omit<HealthCheckup, 'id'>) => {
    const newCheckup: HealthCheckup = { ...checkup, id: `hc-${Date.now()}`};
    setHealthCheckups(prev => [...prev, newCheckup]);
  };

  const handleUpdateCheckup = (updatedCheckup: HealthCheckup) => {
    setHealthCheckups(prev => prev.map(c => c.id === updatedCheckup.id ? updatedCheckup : c));
  };

  const handleDeleteCheckup = (checkupId: string) => {
    setHealthCheckups(prevHealthCheckups => prevHealthCheckups.filter(c => c.id !== checkupId));
  };
  
  const handleAddMedication = (med: Omit<Medication, 'id'>) => {
    const newMed: Medication = { ...med, id: `med-${Date.now()}` };
    setMedications(prev => [...prev, newMed]);
  };

  const handleUpdateMedication = (updatedMed: Medication) => {
    setMedications(prev => prev.map(med => med.id === updatedMed.id ? updatedMed : med));
  };

  const handleDeleteMedication = (medicationId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
  };

  const renderView = () => {
    switch (currentView) {
      case '대시보드':
        return <Dashboard appointments={appointments} caregiverNotes={caregiverNotes} familyMembers={familyMembers} />;
      case '가족 관리':
        return <FamilyManager familyMembers={familyMembers} healthMetrics={healthMetrics} onAddMember={handleAddMember} onUpdateMember={handleUpdateMember} onDeleteMember={handleDeleteMember} onAddHealthMetric={handleAddHealthMetric} />;
      case '건강 캘린더':
        return <HealthCalendar appointments={appointments} familyMembers={familyMembers} onAddAppointment={handleAddAppointment} onDeleteAppointment={handleDeleteAppointment} />;
      case '건강 관리':
        return <HealthManagement 
                  vaccinations={vaccinations} 
                  healthCheckups={healthCheckups} 
                  familyMembers={familyMembers} 
                  onUpdateVaccinationStatus={handleUpdateVaccinationStatus}
                  onUpdateVaccination={handleUpdateVaccination}
                  onAddCheckup={handleAddCheckup}
                  onUpdateCheckup={handleUpdateCheckup}
                  onDeleteCheckup={handleDeleteCheckup}
                />;
      case '요양사 노트':
        return <CaregiverLog notes={caregiverNotes} familyMembers={familyMembers} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />;
      case '복약 관리':
        return <MedicationManager medications={medications} familyMembers={familyMembers} onAddMedication={handleAddMedication} onUpdateMedication={handleUpdateMedication} onDeleteMedication={handleDeleteMedication} />;
      case 'AI 분석':
        return <AiAnalysis familyMembers={familyMembers} caregiverNotes={caregiverNotes} healthMetrics={healthMetrics} />;
      case 'AI 챗봇':
        return <AiChatbot />;
      default:
        return <Dashboard appointments={appointments} caregiverNotes={caregiverNotes} familyMembers={familyMembers} />;
    }
  };

  return (
    <div className="bg-background text-slate-300 min-h-screen font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
