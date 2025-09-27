
import { View, FamilyMember, HealthMetricRecord, Appointment, CaregiverNote, Vaccination, HealthCheckup, Medication } from './types';
import { IconName } from './components/common/Icon';

export const NAV_ITEMS: { name: View; icon: IconName }[] = [
  { name: '대시보드', icon: 'dashboard' },
  { name: '가족 관리', icon: 'users' },
  { name: '건강 캘린더', icon: 'calendar' },
  { name: '건강 관리', icon: 'heart-pulse' },
  { name: '요양사 노트', icon: 'clipboard' },
  { name: '복약 관리', icon: 'pill' },
  { name: 'AI 분석', icon: 'sparkles' },
  { name: 'AI 챗봇', icon: 'microphone' },
];

export const mockHospitals = [
  { id: 'h1', name: '서울대학교병원', specialty: '종합병원', address: '서울특별시 종로구 대학로 101', phone: '02-2072-2114' },
  { id: 'h2', name: '세브란스병원', specialty: '종합병원', address: '서울특별시 서대문구 연세로 50-1', phone: '1599-1004' },
  { id: 'h3', name: '삼성서울병원', specialty: '종합병원', address: '서울특별시 강남구 일원로 81', phone: '02-3410-2114' },
  { id: 'h4', name: '서울아산병원', specialty: '종합병원', address: '서울특별시 송파구 올림픽로43길 88', phone: '1688-7575' },
  { id: 'h5', name: '김안과', specialty: '안과', address: '서울특별시 영등포구 영신로 136', phone: '1577-2264' },
  { id: 'h6', name: '함소아한의원', specialty: '소아과, 한의원', address: '서울특별시 강남구 강남대로 590', phone: '02-517-1075' },
];

// MOCK DATA
export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
    {
      id: 'fm-1',
      name: '강민석',
      birthDate: '2004-02-23',
      gender: '남성',
      relation: '아들',
      height: 170,
      chronicConditions: '고혈압, 당뇨',
      geneticRisks: '대장암',
      smokingHabits: { lifetimeSmoker: true, isCurrentSmoker: false, types: [], duration: 30, amountPerDay: 10 },
      drinkingHabits: { frequency: 2, avgAmount: 3, maxAmount: 5 }
    },
    {
      id: 'fm-2',
      name: '정규원',
      birthDate: '2004-08-20',
      gender: '남성',
      relation: '아들',
      height: 158,
      chronicConditions: '골다공증',
      geneticRisks: '심근경색',
      smokingHabits: { lifetimeSmoker: false, isCurrentSmoker: false, types: [], duration: 0, amountPerDay: 0 },
      drinkingHabits: { frequency: 1, avgAmount: 1, maxAmount: 2 }
    },
    {
      id: 'fm-3',
      name: '김영희',
      birthDate: '1978-05-15',
      gender: '여성',
      relation: '어머니',
      height: 162,
      chronicConditions: '갑상선 기능 저하증',
      geneticRisks: '유방암',
      smokingHabits: { lifetimeSmoker: false, isCurrentSmoker: false, types: [], duration: 0, amountPerDay: 0 },
      drinkingHabits: { frequency: 0, avgAmount: 0, maxAmount: 0 }
    }
];

export const MOCK_HEALTH_METRICS: HealthMetricRecord[] = [
    { id: 'hm-1', familyMemberId: 'fm-1', type: 'weight', value: 75, timestamp: '2023-10-01T09:00:00Z' },
    { id: 'hm-2', familyMemberId: 'fm-1', type: 'bloodPressure', value: { systolic: 140, diastolic: 90 }, timestamp: '2023-10-01T09:00:00Z' },
    { id: 'hm-3', familyMemberId: 'fm-1', type: 'bloodGlucose', value: 130, timestamp: '2023-10-01T09:00:00Z' },
    { id: 'hm-4', familyMemberId: 'fm-2', type: 'weight', value: 58, timestamp: '2023-10-02T09:00:00Z' },
    { id: 'hm-5', familyMemberId: 'fm-1', type: 'weight', value: 74.5, timestamp: '2023-10-15T09:00:00Z' },
    { id: 'hm-6', familyMemberId: 'fm-1', type: 'bloodPressure', value: { systolic: 135, diastolic: 88 }, timestamp: '2023-10-15T09:00:00Z' }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'apt-1', familyMemberId: 'fm-1', hospitalName: '서울대학교병원', reason: '정기 혈압 검사', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:00' },
    { id: 'apt-2', familyMemberId: 'fm-2', hospitalName: '삼성서울병원', reason: '골밀도 검사', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '14:30' },
    { id: 'apt-3', familyMemberId: 'fm-3', hospitalName: '강남세브란스병원', reason: '갑상선 정기 검진', date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00' },
];

export const MOCK_CAREGIVER_NOTES: CaregiverNote[] = [
    { id: 'cn-1', familyMemberId: 'fm-1', author: '간병인', note: '오늘 오후 약간의 어지러움 호소. 혈압 측정 결과 정상 범위.', timestamp: '2023-10-25T14:00:00Z' },
    { id: 'cn-2', familyMemberId: 'fm-2', author: '간병인', note: '산책 후 무릎 통증을 느낌. 온찜질 후 호전됨.', timestamp: '2023-10-24T18:00:00Z' },
    { id: 'cn-3', familyMemberId: 'fm-3', author: '방문 요양사', note: '최근 기력이 없다고 하심. 식사량은 평소와 비슷함.', timestamp: '2023-10-26T10:00:00Z' },
];

export const MOCK_VACCINATIONS: Vaccination[] = [
    { id: 'vac-1', familyMemberId: 'fm-1', name: '독감(인플루엔자)', dueDate: '2024-10-01', completed: true },
    { id: 'vac-2', familyMemberId: 'fm-1', name: '대상포진', dueDate: '2025-05-01', completed: false },
    { id: 'vac-3', familyMemberId: 'fm-2', name: '독감(인플루엔자)', dueDate: '2024-10-01', completed: true },
    { id: 'vac-4', familyMemberId: 'fm-2', name: '폐렴구균', dueDate: '2026-01-01', completed: false },
];

export const MOCK_HEALTH_CHECKUPS: HealthCheckup[] = [
    { id: 'hc-1', familyMemberId: 'fm-1', name: '2023년 정기 건강검진', date: '2023-04-10', resultSummary: '전반적으로 양호하나, 혈압 및 혈당 수치 관찰 필요. 콜레스테롤 수치가 약간 높음.'},
    { id: 'hc-2', familyMemberId: 'fm-2', name: '2023년 정기 건강검진', date: '2023-06-20', resultSummary: '골밀도 수치가 낮아 주의 필요. 비타민D 섭취 권장.'}
];

export const MOCK_MEDICATIONS: Medication[] = [
    { id: 'med-1', familyMemberId: 'fm-1', name: '메트포르민', dosage: '500mg', frequency: '하루 2번 식후', startDate: '2022-01-01', isActive: true },
    { id: 'med-2', familyMemberId: 'fm-1', name: '암로디핀', dosage: '5mg', frequency: '하루 1번', startDate: '2021-05-10', isActive: true },
    { id: 'med-3', familyMemberId: 'fm-2', name: '알렌드로네이트', dosage: '70mg', frequency: '주 1회 기상 직후', startDate: '2023-07-01', isActive: true },
    { id: 'med-4', familyMemberId: 'fm-3', name: '씬지로이드', dosage: '0.1mg', frequency: '하루 1번 아침 식전', startDate: '2020-03-15', isActive: true },
];