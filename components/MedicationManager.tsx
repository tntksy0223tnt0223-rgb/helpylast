import React, { useState, useEffect } from 'react';
import { Medication, FamilyMember } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Icon from './common/Icon';
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';

interface MedicationManagerProps {
  medications: Medication[];
  familyMembers: FamilyMember[];
  onAddMedication: (medication: Omit<Medication, 'id'>) => void;
  onUpdateMedication: (medication: Medication) => void;
  onDeleteMedication: (medicationId: string) => void;
}

const emptyFormState: Omit<Medication, 'id'> = {
  familyMemberId: '',
  name: '',
  dosage: '',
  frequency: '',
  startDate: new Date().toISOString().split('T')[0],
  isActive: true,
};

const MedicationManager: React.FC<MedicationManagerProps> = ({ 
  medications, 
  familyMembers, 
  onAddMedication, 
  onUpdateMedication,
  onDeleteMedication 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | Omit<Medication, 'id'>>(emptyFormState);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Set default family member when modal opens for adding
    if (isModalOpen && !isEditMode && familyMembers.length > 0) {
      setEditingMedication(prev => ({ ...prev, familyMemberId: familyMembers[0].id }));
    }
  }, [isModalOpen, isEditMode, familyMembers]);


  const familyMemberMap = new Map(familyMembers.map(m => [m.id, m.name]));

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingMedication(emptyFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setIsEditMode(true);
    setEditingMedication(med);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setEditingMedication(prev => ({ 
      ...prev, 
      [id]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMedication.familyMemberId && editingMedication.name && editingMedication.dosage && editingMedication.frequency) {
      if (isEditMode) {
        onUpdateMedication(editingMedication as Medication);
      } else {
        onAddMedication(editingMedication);
      }
      closeModal();
    }
  };

  const handleDelete = (id: string) => {
    onDeleteMedication(id);
  };
  
  const medicationsByMember: { [key: string]: Medication[] } = {};
  medications.forEach(c => {
    if (!medicationsByMember[c.familyMemberId]) {
      medicationsByMember[c.familyMemberId] = [];
    }
    medicationsByMember[c.familyMemberId].push(c);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">복약 관리</h2>
        <Button onClick={openAddModal}>
          <div className="flex items-center space-x-2">
            <Icon name="plus" className="w-5 h-5" />
            <span>복약 정보 추가</span>
          </div>
        </Button>
      </div>

      <div className="space-y-8">
        {Object.keys(medicationsByMember).length > 0 ? (
          Object.entries(medicationsByMember).map(([memberId, memberMedications]) => {
            const memberName = familyMemberMap.get(memberId);
            if (!memberName) return null;
            
            return (
              <Card key={memberId} title={memberName}>
                <ul className="divide-y divide-slate-700">
                  {memberMedications
                    .sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map(med => (
                    <li key={med.id} className="py-4 flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-slate-200">{med.name}</h4>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${med.isActive ? 'bg-green-500/20 text-green-300' : 'bg-slate-600 text-slate-300'}`}>
                              {med.isActive ? '복용중' : '중단'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">용량: {med.dosage} | 복용법: {med.frequency}</p>
                        <p className="mt-1 text-xs text-slate-500">시작일: {med.startDate}</p>
                      </div>
                      <div className="ml-4 shrink-0 flex space-x-2">
                         <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => openEditModal(med)}
                        >
                          <Icon name="pencil" className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(med.id)}
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })
        ) : (
          <Card>
            <p className="text-center text-slate-400">등록된 복약 정보가 없습니다.</p>
          </Card>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? "복약 정보 수정" : "새 복약 정보 추가"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="가족 구성원" id="familyMemberId" value={editingMedication.familyMemberId} onChange={handleInputChange} required>
            {familyMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </Select>
          <Input label="약 이름" id="name" value={editingMedication.name} onChange={handleInputChange} required placeholder="예: 아스피린"/>
          <Input label="용량" id="dosage" value={editingMedication.dosage} onChange={handleInputChange} required placeholder="예: 100mg"/>
          <Input label="복용법" id="frequency" value={editingMedication.frequency} onChange={handleInputChange} required placeholder="예: 하루 1번 식후"/>
          <Input label="복용 시작일" id="startDate" type="date" value={editingMedication.startDate} onChange={handleInputChange} required />
          <div className="flex items-center space-x-3">
              <input type="checkbox" id="isActive" checked={editingMedication.isActive} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
              <label htmlFor="isActive" className="text-sm text-slate-300">현재 복용 중</label>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">{isEditMode ? "수정하기" : "추가하기"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicationManager;