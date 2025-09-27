import React, { useState } from 'react';
import { Appointment, FamilyMember } from '../types';
import Button from './common/Button';
import Icon from './common/Icon';
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Card from './common/Card';
import { parseAppointmentFromText } from '../services/geminiService';

interface HealthCalendarProps {
  appointments: Appointment[];
  familyMembers: FamilyMember[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const HealthCalendar: React.FC<HealthCalendarProps> = ({ appointments, familyMembers, onAddAppointment, onDeleteAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    familyMemberId: familyMembers.length > 0 ? familyMembers[0].id : '',
    hospitalName: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
  });

  // New states for AI chatbot
  const [aiInput, setAiInput] = useState('');
  const [aiSelectedMemberId, setAiSelectedMemberId] = useState(familyMembers.length > 0 ? familyMembers[0].id : '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const familyMemberMap = new Map(familyMembers.map(m => [m.id, m.name]));

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewAppointment(prev => ({...prev, [id]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(newAppointment).every(field => field !== '')) {
      onAddAppointment(newAppointment);
      setIsModalOpen(false);
      setNewAppointment({
        familyMemberId: familyMembers.length > 0 ? familyMembers[0].id : '',
        hospitalName: '',
        reason: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
      });
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || !aiSelectedMemberId) {
        setAiError("분석할 내용과 가족 구성원을 확인해주세요.");
        return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
        const appointmentData = await parseAppointmentFromText(aiInput);
        onAddAppointment({
            ...appointmentData,
            familyMemberId: aiSelectedMemberId,
        });
        setAiInput(''); // Clear input on success
    } catch (error) {
        if (error instanceof Error) {
            setAiError(error.message);
        } else {
            setAiError("알 수 없는 오류가 발생했습니다.");
        }
    } finally {
        setIsAiLoading(false);
    }
  };

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-start-${i}`} className="border-r border-b border-slate-700"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(a => a.date === dateString);
    const isToday = dateString === new Date().toISOString().split('T')[0];

    days.push(
      <div key={day} className="border-r border-b border-slate-700 p-2 min-h-[120px] flex flex-col">
        <div className={`font-semibold ${isToday ? 'bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>{day}</div>
        <div className="mt-1 space-y-1 overflow-y-auto">
          {todaysAppointments.map(appt => (
            <div key={appt.id} className="group bg-cyan-900/50 text-cyan-200 p-1.5 rounded-md text-xs relative">
              <p className="font-bold">{familyMemberMap.get(appt.familyMemberId)}</p>
              <p>{appt.reason}</p>
              <p>{appt.time}</p>
              <button
                onClick={() => onDeleteAppointment(appt.id)}
                className="absolute top-1 right-1 p-0.5 bg-red-800/50 text-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700/50"
                aria-label="일정 삭제"
              >
                <Icon name="trash" className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100">건강 캘린더</h2>
            <Button onClick={() => setIsModalOpen(true)}>
              <div className="flex items-center space-x-2">
                <Icon name="plus" className="w-5 h-5"/>
                <span>일정 추가</span>
              </div>
            </Button>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <Button size="sm" variant="secondary" onClick={handlePrevMonth}><Icon name="chevron-left" /></Button>
                <h3 className="text-xl font-semibold text-slate-100">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</h3>
                <Button size="sm" variant="secondary" onClick={handleNextMonth}><Icon name="chevron-right" /></Button>
            </div>
            <div className="grid grid-cols-7 text-center font-bold text-slate-400">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 border-t border-l border-slate-700">
                {days}
            </div>
        </div>
        
        <Card className="mt-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                <Icon name="sparkles" className="w-5 h-5 text-primary-light" />
                <span>AI 일정 추가 도우미</span>
            </h3>
            <form onSubmit={handleAiSubmit} className="space-y-4">
                <Select
                    label="누구의 일정인가요?"
                    id="aiFamilyMember"
                    value={aiSelectedMemberId}
                    onChange={(e) => setAiSelectedMemberId(e.target.value)}
                    required
                >
                    {familyMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name} ({member.relation})</option>
                    ))}
                </Select>
                <div>
                    <Input
                        label="일정을 문장으로 입력하세요"
                        id="aiInput"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="예: 9월 27일 10시에 통영병원 건강검진 추가해줘"
                        required
                    />
                    {aiError && <p className="mt-2 text-sm text-red-400">{aiError}</p>}
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isAiLoading || !aiInput.trim()}>
                        {isAiLoading ? (
                             <div className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>분석 중...</span>
                            </div>
                        ) : (
                            "일정 분석 및 추가"
                        )}
                    </Button>
                </div>
            </form>
        </Card>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="새 일정 추가">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select label="가족 구성원" id="familyMemberId" value={newAppointment.familyMemberId} onChange={handleInputChange} required>
              {familyMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name} ({member.relation})</option>
              ))}
            </Select>
            <Input label="병원 이름" id="hospitalName" value={newAppointment.hospitalName} onChange={handleInputChange} required />
            <Input label="방문 목적" id="reason" value={newAppointment.reason} onChange={handleInputChange} required />
            <Input label="날짜" id="date" type="date" value={newAppointment.date} onChange={handleInputChange} required />
            <Input label="시간" id="time" type="time" value={newAppointment.time} onChange={handleInputChange} required />
            <div className="flex justify-end pt-4">
              <Button type="submit">일정 추가</Button>
            </div>
          </form>
        </Modal>
    </div>
  );
};

export default HealthCalendar;