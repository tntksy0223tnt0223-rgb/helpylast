import React from 'react';
import { Vaccination, FamilyMember } from '../types';
import Card from './common/Card';
import Icon from './common/Icon';

interface VaccinationTrackerProps {
  vaccinations: Vaccination[];
  familyMembers: FamilyMember[];
  onUpdateStatus: (vaccinationId: string, isCompleted: boolean) => void;
}

const VaccinationTracker: React.FC<VaccinationTrackerProps> = ({ vaccinations, familyMembers, onUpdateStatus }) => {
  // Fix: Explicitly type the Map to ensure correct type inference for its values.
  const familyMemberMap = new Map<string, FamilyMember>(familyMembers.map(m => [m.id, m]));
  
  const vaccinationsByMember: { [key: string]: Vaccination[] } = {};
  vaccinations.forEach(v => {
    if (!vaccinationsByMember[v.familyMemberId]) {
      vaccinationsByMember[v.familyMemberId] = [];
    }
    vaccinationsByMember[v.familyMemberId].push(v);
  });

  // Fix: Corrected the logic for checking if a date is overdue. The original logic was always false.
  const isOverdue = (dueDate: string) => new Date(dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);

  return (
    <div>
      {/* Fix: Update text color to match the dark theme. */}
      <h2 className="text-2xl font-bold mb-6 text-slate-100">예방접종 관리</h2>
      <div className="space-y-8">
        {Object.entries(vaccinationsByMember).map(([memberId, memberVaccinations]) => {
          const member = familyMemberMap.get(memberId);
          if (!member) return null;
          
          return (
            <Card key={memberId} title={`${member.name} (${member.relation})`}>
              {/* Fix: Update text and divider colors to match the dark theme. */}
              <ul className="divide-y divide-slate-700">
                {memberVaccinations
                  .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map(v => (
                  <li key={v.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-semibold text-slate-200">{v.name}</p>
                      <p className={`text-sm ${v.completed ? 'text-green-400' : isOverdue(v.dueDate) ? 'text-red-400' : 'text-slate-400'}`}>
                        {v.completed ? '접종 완료' : `예정일: ${v.dueDate}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => onUpdateStatus(v.id, !v.completed)}
                      className={`p-2 rounded-full transition-colors ${v.completed ? 'bg-green-800/50 text-green-300 hover:bg-green-700/50' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                      {v.completed ? <Icon name="x-mark" className="w-5 h-5"/> : <Icon name="check" className="w-5 h-5"/>}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VaccinationTracker;