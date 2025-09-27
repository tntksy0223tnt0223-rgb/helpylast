import React, { useState, useMemo } from 'react';
import { FamilyMember, HealthMetricRecord, BloodPressure, SmokingHabits, DrinkingHabits, HealthMetricType } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Icon from './common/Icon';
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Textarea from './common/Textarea';

interface FamilyManagerProps {
  familyMembers: FamilyMember[];
  healthMetrics: HealthMetricRecord[];
  onAddMember: (member: Omit<FamilyMember, 'id'>, initialWeight?: number) => void;
  onUpdateMember: (member: FamilyMember) => void;
  onDeleteMember: (id: string) => void;
  onAddHealthMetric: (metric: Omit<HealthMetricRecord, 'id'>) => void;
}

const emptySmokingHabits: SmokingHabits = {
  lifetimeSmoker: false,
  isCurrentSmoker: false,
  types: [],
  duration: 0,
  amountPerDay: 0,
};

const emptyDrinkingHabits: DrinkingHabits = {
  frequency: 0,
  avgAmount: 0,
  maxAmount: 0,
};

const emptyFormState = {
  name: '',
  birthDate: '',
  gender: '남성' as '남성' | '여성',
  relation: '',
  height: '',
  initialWeight: '',
  chronicConditions: '',
  geneticRisks: '',
  smokingHabits: emptySmokingHabits,
  drinkingHabits: emptyDrinkingHabits,
};


const FamilyManager: React.FC<FamilyManagerProps> = ({ 
  familyMembers, 
  healthMetrics,
  onAddMember, 
  onUpdateMember, 
  onDeleteMember,
  onAddHealthMetric
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [addFormState, setAddFormState] = useState(emptyFormState);
  
  // State for the detail modal forms
  const [profileFormState, setProfileFormState] = useState<FamilyMember | null>(null);
  const [metricFormState, setMetricFormState] = useState({
      timestamp: new Date().toISOString().split('T')[0],
      weight: '',
      systolic: '',
      diastolic: '',
      bloodGlucose: '',
  });

  const openAddModal = () => {
    setAddFormState(emptyFormState);
    setIsAddModalOpen(true);
  };
  
  const openDetailModal = (member: FamilyMember) => {
    setSelectedMember(member);
    setProfileFormState(member);
    // Reset metric form when opening
    setMetricFormState({
      timestamp: new Date().toISOString().split('T')[0],
      weight: '',
      systolic: '',
      diastolic: '',
      bloodGlucose: '',
    });
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedMember(null);
    setProfileFormState(null);
  };

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    if (id.startsWith('smokingHabits.')) {
        const key = id.split('.')[1] as keyof SmokingHabits;
        const isCheckbox = type === 'checkbox';
        const isMultiCheckbox = ['types'].includes(key);

        setAddFormState(prev => {
            const habits = { ...prev.smokingHabits };
            if (isCheckbox) {
                if (isMultiCheckbox) {
                    const currentTypes = habits.types as ('일반담배' | '궐련형 전자담배' | '액상형 전자담배')[];
                    const newTypes = currentTypes.includes(value as any)
                        ? currentTypes.filter(t => t !== value)
                        : [...currentTypes, value as any];
                    (habits[key] as any) = newTypes;
                } else {
                    (habits[key] as any) = (e.target as HTMLInputElement).checked;
                }
            } else {
                // Fix: Convert string value from input to number for numeric properties.
                (habits[key] as any) = Number(value);
            }
            return { ...prev, smokingHabits: habits };
        });
    } else if (id.startsWith('drinkingHabits.')) {
        const key = id.split('.')[1] as keyof DrinkingHabits;
        setAddFormState(prev => ({
            ...prev,
            // Fix: Convert string value from input to number.
            drinkingHabits: { ...prev.drinkingHabits, [key]: Number(value) }
        }));
    } else {
        setAddFormState(prev => ({ ...prev, [id]: value }));
    }
  };
  
  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!profileFormState) return;
    const { id, value, type } = e.target;
    
    // Nested state update logic here, similar to handleAddFormChange
     if (id.startsWith('smokingHabits.')) {
        const key = id.split('.')[1] as keyof SmokingHabits;
        const isCheckbox = type === 'checkbox';
        const isMultiCheckbox = ['types'].includes(key);

        setProfileFormState(prev => {
            if (!prev) return null;
            const habits = { ...prev.smokingHabits };
            if (isCheckbox) {
                if (isMultiCheckbox) {
                    const currentTypes = habits.types as string[];
                    const newTypes = currentTypes.includes(value)
                        ? currentTypes.filter(t => t !== value)
                        : [...currentTypes, value];
                    (habits[key] as any) = newTypes;
                } else {
                    (habits[key] as any) = (e.target as HTMLInputElement).checked;
                }
            } else {
                 // Fix: Convert string value from input to number for numeric properties.
                 (habits[key] as any) = Number(value);
            }
            return { ...prev, smokingHabits: habits };
        });
    } else if (id.startsWith('drinkingHabits.')) {
        const key = id.split('.')[1] as keyof DrinkingHabits;
        setProfileFormState(prev => (prev ? {
            ...prev,
            // Fix: Convert string value from input to number.
            drinkingHabits: { ...prev.drinkingHabits, [key]: Number(value) }
        } : null));
    } else {
        setProfileFormState(prev => (prev ? { ...prev, [id]: value } : null));
    }
  };
  
  const handleMetricFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setMetricFormState(prev => ({ ...prev, [id]: value }));
  };


  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { initialWeight, ...memberData } = addFormState;
    const newMember: Omit<FamilyMember, 'id'> = {
        ...memberData,
        height: parseInt(memberData.height, 10),
        smokingHabits: {
            ...memberData.smokingHabits,
            duration: parseInt(memberData.smokingHabits.duration as any, 10) || 0,
            amountPerDay: parseInt(memberData.smokingHabits.amountPerDay as any, 10) || 0,
        },
        drinkingHabits: {
            frequency: parseInt(memberData.drinkingHabits.frequency as any, 10) || 0,
            avgAmount: parseInt(memberData.drinkingHabits.avgAmount as any, 10) || 0,
            maxAmount: parseInt(memberData.drinkingHabits.maxAmount as any, 10) || 0,
        }
    };
    onAddMember(newMember, initialWeight ? parseInt(initialWeight, 10) : undefined);
    closeModal();
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileFormState) {
        // Ensure numeric types are correct
        const updatedMember: FamilyMember = {
            ...profileFormState,
            height: Number(profileFormState.height),
            smokingHabits: {
                ...profileFormState.smokingHabits,
                duration: Number(profileFormState.smokingHabits.duration),
                amountPerDay: Number(profileFormState.smokingHabits.amountPerDay),
            },
            drinkingHabits: {
                frequency: Number(profileFormState.drinkingHabits.frequency),
                avgAmount: Number(profileFormState.drinkingHabits.avgAmount),
                maxAmount: Number(profileFormState.drinkingHabits.maxAmount),
            }
        };
        onUpdateMember(updatedMember);
        // Maybe provide some feedback to the user
    }
  };

  const handleMetricSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    const { timestamp, weight, systolic, diastolic, bloodGlucose } = metricFormState;
    
    if (weight) {
        onAddHealthMetric({ familyMemberId: selectedMember.id, type: 'weight', value: parseFloat(weight), timestamp: new Date(timestamp).toISOString() });
    }
    if (systolic && diastolic) {
        onAddHealthMetric({ familyMemberId: selectedMember.id, type: 'bloodPressure', value: { systolic: parseInt(systolic), diastolic: parseInt(diastolic) }, timestamp: new Date(timestamp).toISOString() });
    }
    if (bloodGlucose) {
        onAddHealthMetric({ familyMemberId: selectedMember.id, type: 'bloodGlucose', value: parseInt(bloodGlucose), timestamp: new Date(timestamp).toISOString() });
    }

    // Clear form
    setMetricFormState({
      ...metricFormState,
      weight: '',
      systolic: '',
      diastolic: '',
      bloodGlucose: '',
    });
  };

  const memberMetrics = useMemo(() => {
    if (!selectedMember) return [];
    return healthMetrics
      .filter(m => m.familyMemberId === selectedMember.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedMember, healthMetrics]);

  const getMetricChange = (metricType: HealthMetricType, currentIndex: number) => {
      const currentMetric = memberMetrics[currentIndex];
      const previousMetric = memberMetrics.slice(currentIndex + 1).find(m => m.type === metricType);

      if (!previousMetric || currentMetric.type !== metricType) return null;

      const currentValue = currentMetric.value;
      const previousValue = previousMetric.value;

      if (metricType === 'bloodPressure') {
          const current = currentValue as BloodPressure;
          const prev = previousValue as BloodPressure;
          const sysChange = current.systolic - prev.systolic;
          const diaChange = current.diastolic - prev.diastolic;
          
          if (sysChange === 0 && diaChange === 0) return null;

          const sysColor = sysChange > 0 ? 'text-red-400' : 'text-blue-400';
          const diaColor = diaChange > 0 ? 'text-red-400' : 'text-blue-400';

          return (
            <span className="ml-2 text-xs font-semibold">
                (<span className={sysChange !== 0 ? sysColor : 'text-slate-500'}>{sysChange > 0 ? '+' : ''}{sysChange}</span>
                /
                <span className={diaChange !== 0 ? diaColor : 'text-slate-500'}>{diaChange > 0 ? '+' : ''}{diaChange}</span>)
            </span>
          );
      } else {
          const change = (currentValue as number) - (previousValue as number);
          if (change === 0) return null;
          
          const color = change > 0 ? 'text-red-400' : 'text-blue-400';

          return <span className={`ml-2 text-xs font-semibold ${color}`}>({(change > 0 ? '+' : '')}{change.toFixed(1)})</span>;
      }
  };
  
  const renderHabitIcons = (member: FamilyMember) => (
    <div className="flex space-x-2 items-center">
      {member.smokingHabits.isCurrentSmoker && (
        <div title="흡연자">
          <Icon name="no-smoking" className="w-5 h-5 text-red-400" />
        </div>
      )}
      {member.drinkingHabits.frequency > 0 && (
         <div title={`주 ${member.drinkingHabits.frequency}회 음주`}>
          <Icon name="wine-glass" className="w-5 h-5 text-purple-400" />
        </div>
      )}
    </div>
  );

  const renderAddMemberForm = (state: typeof addFormState, handler: typeof handleAddFormChange) => (
      <>
        <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-600 pb-2 mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="이름" id="name" value={state.name} onChange={handler} required />
            <Input label="관계 (예: 부모)" id="relation" value={state.relation} onChange={handler} required />
            <Input label="생년월일" id="birthDate" type="date" value={state.birthDate} onChange={handler} required />
            <Select label="성별" id="gender" value={state.gender} onChange={handler} required>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
            </Select>
            <Input label="키 (cm)" id="height" type="number" value={state.height} onChange={handler} required />
            <Input label="초기 몸무게 (kg)" id="initialWeight" type="number" value={state.initialWeight} onChange={handler} />
        </div>
        <div className="mt-4">
            <Textarea label="기저 질환 (쉼표로 구분)" id="chronicConditions" value={state.chronicConditions} onChange={handler} rows={2}/>
        </div>
        <div className="mt-4">
            <Textarea label="가족 내 유전 질환 (쉼표로 구분)" id="geneticRisks" value={state.geneticRisks} onChange={handler} rows={2}/>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-600 pb-2 my-4">음주 습관</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="음주 빈도 (주 몇 회)" id="drinkingHabits.frequency" type="number" value={state.drinkingHabits.frequency.toString()} onChange={handler} />
          <Input label="평균 음주량 (하루 몇 잔)" id="drinkingHabits.avgAmount" type="number" value={state.drinkingHabits.avgAmount.toString()} onChange={handler} />
          <Input label="최대 음주량 (하루 몇 잔)" id="drinkingHabits.maxAmount" type="number" value={state.drinkingHabits.maxAmount.toString()} onChange={handler} />
        </div>

        <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-600 pb-2 my-4">흡연 습관</h3>
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <input type="checkbox" id="smokingHabits.lifetimeSmoker" checked={state.smokingHabits.lifetimeSmoker} onChange={handler} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                <label htmlFor="smokingHabits.lifetimeSmoker" className="text-sm text-slate-300">평생 총 5갑(100개비) 이상 흡연</label>
            </div>
            <div className="flex items-center space-x-3">
                <input type="checkbox" id="smokingHabits.isCurrentSmoker" checked={state.smokingHabits.isCurrentSmoker} onChange={handler} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                <label htmlFor="smokingHabits.isCurrentSmoker" className="text-sm text-slate-300">현재 흡연 여부</label>
            </div>
            {state.smokingHabits.isCurrentSmoker && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-slate-400">현재 흡연 종류 (중복 가능)</label>
                        <div className="mt-2 flex space-x-4">
                           {['일반담배', '궐련형 전자담배', '액상형 전자담배'].map(type => (
                                <div key={type} className="flex items-center">
                                    <input type="checkbox" id="smokingHabits.types" value={type} checked={state.smokingHabits.types.includes(type as any)} onChange={handler} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                    <label htmlFor="smokingHabits.types" className="ml-2 block text-sm text-slate-300">{type}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="흡연 기간 (년)" id="smokingHabits.duration" type="number" value={state.smokingHabits.duration.toString()} onChange={handler} />
                        <Input label="하루 평균 흡연량 (개비)" id="smokingHabits.amountPerDay" type="number" value={state.smokingHabits.amountPerDay.toString()} onChange={handler} />
                    </div>
                </>
            )}
        </div>
      </>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">가족 관리</h2>
        <Button onClick={openAddModal}>
          <div className="flex items-center space-x-2">
            <Icon name="plus" className="w-5 h-5" />
            <span>가족 구성원 추가</span>
          </div>
        </Button>
      </div>

      <div className="space-y-4">
        {familyMembers.length > 0 ? familyMembers.map(member => (
          <Card key={member.id}>
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex-grow">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-xl font-bold text-primary-light">{member.name} <span className="text-base font-normal text-slate-400">({member.relation})</span></h3>
                         {renderHabitIcons(member)}
                    </div>
                    <p className="text-sm text-slate-300 mt-2">생년월일: {member.birthDate} | 성별: {member.gender} | 키: {member.height}cm</p>
                    <p className="text-sm text-slate-300 mt-1">기저질환: {member.chronicConditions || '없음'}</p>
                    <p className="text-sm text-slate-300 mt-1">유전위험: {member.geneticRisks || '없음'}</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-4 shrink-0">
                    <Button variant="secondary" onClick={() => openDetailModal(member)}>
                        <Icon name="medical-kit" className="w-4 h-4" />
                        <span className="ml-1.5">자세히 보기 & 기록</span>
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDeleteMember(member.id)}>
                        <Icon name="trash" className="w-4 h-4" />
                    </Button>
                </div>
            </div>
          </Card>
        )) : (
          <Card>
            <p className="text-center text-slate-400">등록된 가족 구성원이 없습니다. '가족 구성원 추가' 버튼을 눌러 시작하세요.</p>
          </Card>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={closeModal} title={'새 가족 구성원 추가'}>
        <form onSubmit={handleAddSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {renderAddMemberForm(addFormState, handleAddFormChange)}
            <div className="flex justify-end pt-6 border-t border-slate-700">
                <Button type="submit">추가하기</Button>
            </div>
        </form>
      </Modal>
      
      {selectedMember && profileFormState && (
        <Modal isOpen={isDetailModalOpen} onClose={closeModal} title={`${selectedMember.name}님 건강 정보`}>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Profile Edit Section */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Fix: Provide default values for optional fields from FamilyMember type to match the form's expected state type. */}
                  {renderAddMemberForm(
                    {
                      ...profileFormState,
                      initialWeight: '',
                      height: profileFormState.height.toString(),
                      chronicConditions: profileFormState.chronicConditions ?? '',
                      geneticRisks: profileFormState.geneticRisks ?? '',
                    }, 
                    handleProfileFormChange as any
                  )}
                  <div className="flex justify-end pt-6 border-t border-slate-700">
                      <Button type="submit">프로필 정보 저장</Button>
                  </div>
              </form>
              
              {/* New Metric Section */}
              <form onSubmit={handleMetricSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-600 pb-2 mb-4">새로운 건강 기록 추가</h3>
                  <Input label="측정 날짜" id="timestamp" type="date" value={metricFormState.timestamp} onChange={handleMetricFormChange} required/>
                  <Input label="몸무게 (kg)" id="weight" type="number" placeholder="예: 65.5" value={metricFormState.weight} onChange={handleMetricFormChange} />
                  <div className="grid grid-cols-2 gap-4">
                      <Input label="혈압 (수축기)" id="systolic" type="number" placeholder="예: 120" value={metricFormState.systolic} onChange={handleMetricFormChange} />
                      <Input label="혈압 (이완기)" id="diastolic" type="number" placeholder="예: 80" value={metricFormState.diastolic} onChange={handleMetricFormChange} />
                  </div>
                   <Input label="식전 혈당 (mg/dL)" id="bloodGlucose" type="number" placeholder="예: 98" value={metricFormState.bloodGlucose} onChange={handleMetricFormChange} />
                   <div className="flex justify-end pt-4">
                       <Button type="submit">기록 추가</Button>
                   </div>
              </form>
              
              {/* History Section */}
              <div>
                  <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-600 pb-2 mb-4">건강 기록 히스토리</h3>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-400">
                          <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                              <tr>
                                  <th scope="col" className="px-4 py-3">날짜</th>
                                  <th scope="col" className="px-4 py-3">체중(kg)</th>
                                  <th scope="col" className="px-4 py-3">혈압(mmHg)</th>
                                  <th scope="col" className="px-4 py-3">혈당(mg/dL)</th>
                              </tr>
                          </thead>
                          <tbody>
                              {memberMetrics.length > 0 ? memberMetrics.map((metric, index) => {
                                const bp = metric.type === 'bloodPressure' ? metric.value as BloodPressure : null;
                                return (
                                <tr key={metric.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                    <td className="px-4 py-3">{new Date(metric.timestamp).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        {metric.type === 'weight' ? 
                                            <span>
                                                {metric.value as number}
                                                {getMetricChange('weight', index)}
                                            </span> 
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {bp ? 
                                            <span className="font-semibold text-blue-400">
                                                {`${bp.systolic}/${bp.diastolic}`}
                                                {getMetricChange('bloodPressure', index)}
                                            </span> 
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {metric.type === 'bloodGlucose' ? 
                                            <span className="font-semibold text-red-400">
                                                {metric.value as number}
                                                {getMetricChange('bloodGlucose', index)}
                                            </span> 
                                            : '-'}
                                    </td>
                                </tr>
                              )}) : (
                                  <tr>
                                      <td colSpan={4} className="text-center py-4">기록된 건강 지표가 없습니다.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default FamilyManager;