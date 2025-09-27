import React from 'react';
import { Appointment, CaregiverNote, FamilyMember } from '../types';
import Card from './common/Card';
import Icon from './common/Icon';

const Dashboard: React.FC<{
  appointments: Appointment[];
  caregiverNotes: CaregiverNote[];
  familyMembers: FamilyMember[];
}> = ({ appointments, caregiverNotes, familyMembers }) => {

  const familyMemberMap = new Map(familyMembers.map(m => [m.id, m.name]));

  const upcomingAppointments = appointments
    .filter(a => new Date(a.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentNotes = caregiverNotes
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);
    
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(dateString);
    eventDate.setHours(0,0,0,0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    return `${diffDays}일 후`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">안녕하세요!</h1>
        <p className="mt-2 text-lg text-slate-400">오늘의 건강 소식을 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card title="다가오는 일정">
          {upcomingAppointments.length > 0 ? (
            <ul className="space-y-4">
              {upcomingAppointments.map(appt => (
                <li key={appt.id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-slate-800/50">
                  <div className="bg-primary/20 text-primary p-2 rounded-lg shrink-0">
                    <Icon name="calendar" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{familyMemberMap.get(appt.familyMemberId)} - {appt.reason}</p>
                    <p className="text-sm text-slate-400">{appt.hospitalName}</p>
                    <p className="text-sm text-slate-400">{appt.date} ({getDaysUntil(appt.date)}) {appt.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-4">다가오는 일정이 없습니다.</p>
          )}
        </Card>

        {/* Recent Caregiver Notes */}
        <Card title="최신 요양사 노트">
          {recentNotes.length > 0 ? (
            <ul className="space-y-3">
              {recentNotes.map(note => (
                <li key={note.id} className="p-2 rounded-lg hover:bg-slate-800/50">
                  <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-200">{familyMemberMap.get(note.familyMemberId)}</p>
                        <p className="text-sm text-slate-400">작성자: {note.author}</p>
                      </div>
                      <p className="text-xs text-slate-500 shrink-0 ml-2">{new Date(note.timestamp).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-300 truncate">{note.note}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-4">최신 노트가 없습니다.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;