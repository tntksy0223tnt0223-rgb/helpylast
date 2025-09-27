import React, { useState, useEffect } from 'react';
import { Appointment, CaregiverNote, FamilyMember, VaccinationRecommendation } from '../types';
import { getVaccinationRecommendations } from '../services/geminiService';
import Card from './common/Card';
import Icon from './common/Icon';

const Dashboard: React.FC<{
  appointments: Appointment[];
  caregiverNotes: CaregiverNote[];
  familyMembers: FamilyMember[];
}> = ({ appointments, caregiverNotes, familyMembers }) => {

  const [vaccinePlan, setVaccinePlan] = useState<VaccinationRecommendation[]>([]);
  const [isPlanLoading, setIsPlanLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaccinePlan = async () => {
      if (familyMembers.length === 0) {
        setIsPlanLoading(false);
        return;
      }
      try {
        setIsPlanLoading(true);
        setPlanError(null);
        const recommendations = await getVaccinationRecommendations(familyMembers);
        setVaccinePlan(recommendations);
      } catch (error) {
        console.error(error);
        setPlanError('AI 예방접종 계획을 불러오는 데 실패했습니다.');
      } finally {
        setIsPlanLoading(false);
      }
    };
    fetchVaccinePlan();
  }, [familyMembers]);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vaccination and Checkup Guide */}
        <Card title="예방접종 및 건강검진 안내">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              정기적인 예방접종과 건강검진은 질병을 예방하고 조기에 발견하는 가장 효과적인 방법입니다. 특히 연령에 따라 권장되는 항목이 다르므로 꾸준한 관심이 필요합니다.
            </p>
            <div className="border-t border-slate-700 pt-4">
              <h4 className="font-semibold text-slate-200 mb-3 flex items-center space-x-2">
                <Icon name="syringe" className="w-5 h-5 text-primary-light" />
                <span>AI 가족 예방접종 계획 (1년)</span>
              </h4>
              {isPlanLoading ? (
                <p className="text-slate-400 text-center animate-pulse">AI가 맞춤 예방접종 계획을 생성 중입니다...</p>
              ) : planError ? (
                <p className="text-red-400 text-center">{planError}</p>
              ) : vaccinePlan.length > 0 ? (
                <ul className="space-y-4 text-sm">
                  {vaccinePlan.map(rec => (
                    <li key={rec.familyMemberId}>
                      <p className="font-bold text-primary-light">{rec.familyMemberName}</p>
                      <ul className="list-disc list-inside pl-2 text-slate-300 mt-1">
                        {rec.recommendedVaccines.length > 0 ? rec.recommendedVaccines.map((vaccine, idx) => (
                          <li key={idx}>{vaccine.name} <span className="text-slate-500">({vaccine.reason})</span></li>
                        )) : (
                          <li>향후 1년 내 필수 권장 접종이 없습니다.</li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-center">추천할 예방접종 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </Card>
        
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