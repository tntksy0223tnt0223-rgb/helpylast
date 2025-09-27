import React, { useState } from 'react';
import { Vaccination, HealthCheckup, FamilyMember } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Icon from './common/Icon';
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Textarea from './common/Textarea';

interface HealthManagementProps {
  vaccinations: Vaccination[];
  healthCheckups: HealthCheckup[];
  familyMembers: FamilyMember[];
  onUpdateVaccinationStatus: (vaccinationId: string, isCompleted: boolean) => void;
  onUpdateVaccination: (vaccination: Vaccination) => void;
  onAddCheckup: (checkup: Omit<HealthCheckup, 'id'>) => void;
  onUpdateCheckup: (checkup: HealthCheckup) => void;
  onDeleteCheckup: (checkupId: string) => void;
}

const emptyCheckupForm: Omit<HealthCheckup, 'id'> = {
  familyMemberId: '',
  name: '',
  date: new Date().toISOString().split('T')[0],
  resultSummary: '',
};

const HealthManagement: React.FC<HealthManagementProps> = ({
  vaccinations,
  healthCheckups,
  familyMembers,
  onUpdateVaccinationStatus,
  onUpdateVaccination,
  onAddCheckup,
  onUpdateCheckup,
  onDeleteCheckup,
}) => {
  const [isCheckupModalOpen, setIsCheckupModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCheckup, setEditingCheckup] = useState<HealthCheckup | Omit<HealthCheckup, 'id'>>(emptyCheckupForm);

  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);

  const dataByMember: { [key: string]: { member: FamilyMember, vaccinations: Vaccination[], healthCheckups: HealthCheckup[] } } = {};

  familyMembers.forEach(member => {
    dataByMember[member.id] = {
      member: member,
      vaccinations: vaccinations.filter(v => v.familyMemberId === member.id)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
      healthCheckups: healthCheckups.filter(c => c.familyMemberId === member.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  });
  
  const isPastAndIncomplete = (v: Vaccination) => !v.completed && new Date(v.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);

  const openAddCheckupModal = (memberId: string) => {
    setIsEditMode(false);
    setEditingCheckup({
        ...emptyCheckupForm,
        familyMemberId: memberId,
    });
    setIsCheckupModalOpen(true);
  };

  const openEditCheckupModal = (checkup: HealthCheckup) => {
    setIsEditMode(true);
    setEditingCheckup(checkup);
    setIsCheckupModalOpen(true);
  };

  const closeCheckupModal = () => {
    setIsCheckupModalOpen(false);
  };
  
  const openEditVaccinationModal = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination);
    setIsVaccinationModalOpen(true);
  };
  
  const closeVaccinationModal = () => {
    setIsVaccinationModalOpen(false);
    setEditingVaccination(null);
  };

  const handleCheckupInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditingCheckup(prev => ({ ...prev, [id]: value }));
  };
  
  const handleVaccinationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingVaccination) {
        setEditingVaccination({ ...editingVaccination, dueDate: e.target.value });
    }
  };

  const handleCheckupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCheckup.familyMemberId && editingCheckup.name && editingCheckup.date && editingCheckup.resultSummary) {
      if (isEditMode) {
        onUpdateCheckup(editingCheckup as HealthCheckup);
      } else {
        onAddCheckup(editingCheckup);
      }
      closeCheckupModal();
    }
  };
  
  const handleVaccinationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVaccination) {
        onUpdateVaccination(editingVaccination);
        closeVaccinationModal();
    }
  };

  const handleCheckupDelete = (id: string) => {
    onDeleteCheckup(id);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-100">건강 관리</h2>
      <div className="space-y-8">
        {familyMembers.length > 0 ? (
          Object.values(dataByMember).map(({ member, vaccinations, healthCheckups }) => (
            <Card key={member.id} title={`${member.name} (${member.relation})`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Vaccinations Section */}
                <div>
                  <h4 className="font-semibold text-lg text-slate-200 mb-3">예방접종</h4>
                  {vaccinations.length > 0 ? (
                    <ul className="space-y-3">
                      {vaccinations.map(v => (
                        <li key={v.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                          <div>
                            <p className="font-semibold text-slate-200">{v.name}</p>
                            <p className={`text-sm ${v.completed ? 'text-green-400' : isPastAndIncomplete(v) ? 'text-red-400' : 'text-slate-400'}`}>
                              {v.completed ? `접종 완료` : `예정일: ${v.dueDate}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openEditVaccinationModal(v)}
                                className="!p-1.5"
                                aria-label="Edit vaccination date"
                            >
                                <Icon name="pencil" className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant={v.completed ? 'secondary' : 'primary'}
                                onClick={() => onUpdateVaccinationStatus(v.id, !v.completed)}
                            >
                                {v.completed ? '완료 취소' : '접종 완료'}
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 text-sm p-3 bg-slate-900/50 rounded-lg">예정된 예방접종이 없습니다.</p>
                  )}
                </div>
                
                {/* Health Checkups Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg text-slate-200">건강검진 기록</h4>
                    <Button size="sm" variant="secondary" onClick={() => openAddCheckupModal(member.id)}>
                        <Icon name="plus" className="w-4 h-4 mr-1" />
                        추가
                    </Button>
                  </div>
                  {healthCheckups.length > 0 ? (
                     <ul className="space-y-3">
                      {healthCheckups.map(c => (
                         <li key={c.id} className="p-3 bg-slate-900/50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-slate-200">{c.name}</p>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0 ml-2">
                                <p className="text-xs text-slate-500">{c.date}</p>
                                <Button size="sm" variant="secondary" className="!p-1.5" onClick={() => openEditCheckupModal(c)}>
                                    <Icon name="pencil" className="w-4 h-4"/>
                                </Button>
                                <Button size="sm" variant="danger" className="!p-1.5" onClick={() => handleCheckupDelete(c.id)}>
                                    <Icon name="trash" className="w-4 h-4"/>
                                </Button>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-slate-300 whitespace-pre-wrap">{c.resultSummary}</p>
                         </li>
                      ))}
                     </ul>
                  ) : (
                    <p className="text-slate-400 text-sm p-3 bg-slate-900/50 rounded-lg">등록된 건강검진 기록이 없습니다.</p>
                  )}
                </div>

              </div>
            </Card>
          ))
        ) : (
           <Card>
            <p className="text-center text-slate-400">가족 구성원을 먼저 등록해주세요.</p>
          </Card>
        )}
      </div>

      <Modal isOpen={isCheckupModalOpen} onClose={closeCheckupModal} title={isEditMode ? "건강검진 기록 수정" : "새 건강검진 기록 추가"}>
        <form onSubmit={handleCheckupSubmit} className="space-y-4">
          <Select 
            label="가족 구성원" 
            id="familyMemberId" 
            value={editingCheckup.familyMemberId} 
            onChange={handleCheckupInputChange} 
            required
            >
            {familyMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </Select>
          <Input label="검진 이름" id="name" value={editingCheckup.name} onChange={handleCheckupInputChange} required placeholder="예: 2024년 정기 건강검진"/>
          <Input label="검진 날짜" id="date" type="date" value={editingCheckup.date} onChange={handleCheckupInputChange} required />
          <Textarea 
            label="결과 요약" 
            id="resultSummary" 
            name="resultSummary"
            value={editingCheckup.resultSummary} 
            onChange={handleCheckupInputChange}
            rows={5}
            required
            placeholder="검진 결과를 요약하여 입력하세요."
          />
          <div className="flex justify-end pt-4 border-t border-slate-700">
            <Button type="submit">{isEditMode ? "수정하기" : "추가하기"}</Button>
          </div>
        </form>
      </Modal>

      {editingVaccination && (
        <Modal isOpen={isVaccinationModalOpen} onClose={closeVaccinationModal} title="예방접종 예정일 수정">
            <form onSubmit={handleVaccinationSubmit} className="space-y-4">
            <div>
                <p className="block text-sm font-medium text-slate-400">접종 이름</p>
                <p className="mt-1 text-slate-200">{editingVaccination.name}</p>
            </div>
            <Input 
                label="새 예정일" 
                id="dueDate" 
                type="date" 
                value={editingVaccination.dueDate} 
                onChange={handleVaccinationDateChange} 
                required 
            />
            <div className="flex justify-end pt-4 border-t border-slate-700">
                <Button type="submit">저장하기</Button>
            </div>
            </form>
        </Modal>
      )}

    </div>
  );
};

export default HealthManagement;