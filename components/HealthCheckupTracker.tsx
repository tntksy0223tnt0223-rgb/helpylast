// Fix: Implemented the missing HealthCheckupTracker component.
import React, { useState } from 'react';
import { HealthCheckup, FamilyMember } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Icon from './common/Icon';
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Textarea from './common/Textarea';

interface HealthCheckupTrackerProps {
  checkups: HealthCheckup[];
  familyMembers: FamilyMember[];
  onAddCheckup: (checkup: Omit<HealthCheckup, 'id'>) => void;
}

const HealthCheckupTracker: React.FC<HealthCheckupTrackerProps> = ({ checkups, familyMembers, onAddCheckup }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialFormState = {
    familyMemberId: familyMembers.length > 0 ? familyMembers[0].id : '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    resultSummary: '',
  };
  const [newCheckup, setNewCheckup] = useState(initialFormState);
  
  const familyMemberMap = new Map(familyMembers.map(m => [m.id, m.name]));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCheckup(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(newCheckup).every(field => field !== '')) {
      onAddCheckup(newCheckup);
      setIsModalOpen(false);
      setNewCheckup(initialFormState);
    }
  };

  const checkupsByMember: { [key: string]: HealthCheckup[] } = {};
  checkups.forEach(c => {
    if (!checkupsByMember[c.familyMemberId]) {
      checkupsByMember[c.familyMemberId] = [];
    }
    checkupsByMember[c.familyMemberId].push(c);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {/* Fix: Update text color to match the dark theme. */}
        <h2 className="text-2xl font-bold text-slate-100">건강검진 기록</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center space-x-2">
            <Icon name="plus" className="w-5 h-5" />
            <span>검진 기록 추가</span>
          </div>
        </Button>
      </div>

      <div className="space-y-8">
        {checkups.length > 0 ? (
          Object.entries(checkupsByMember).map(([memberId, memberCheckups]) => {
            const memberName = familyMemberMap.get(memberId);
            if (!memberName) return null;
            
            return (
              <Card key={memberId} title={memberName}>
                {/* Fix: Update text and border colors to match the dark theme of the app. */}
                <ul className="divide-y divide-slate-700">
                  {memberCheckups
                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(checkup => (
                    <li key={checkup.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-slate-200">{checkup.name}</h4>
                        <p className="text-sm text-slate-400">{checkup.date}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">{checkup.resultSummary}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })
        ) : (
          <Card>
            <p className="text-center text-slate-400">등록된 건강검진 기록이 없습니다.</p>
          </Card>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="새 건강검진 기록 추가">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="가족 구성원" id="familyMemberId" value={newCheckup.familyMemberId} onChange={handleInputChange} required>
            {familyMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </Select>
          <Input label="검진 이름 (예: 정기 건강검진)" id="name" value={newCheckup.name} onChange={handleInputChange} required />
          <Input label="검진 날짜" id="date" type="date" value={newCheckup.date} onChange={handleInputChange} required />
          <Textarea 
            label="결과 요약" 
            id="resultSummary" 
            name="resultSummary" 
            value={newCheckup.resultSummary} 
            onChange={handleInputChange} 
            rows={5}
            required
          />
          <div className="flex justify-end pt-4">
            <Button type="submit">기록 추가</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HealthCheckupTracker;