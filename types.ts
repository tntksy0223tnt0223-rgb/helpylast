
import { IconName } from './components/common/Icon';

// Fix: Manually define View type to break circular dependency with constants.ts
export type View = '대시보드' | '가족 관리' | '건강 캘린더' | '건강 관리' | '요양사 노트' | '복약 관리' | 'AI 분석' | 'AI 챗봇';

export interface SmokingHabits {
  lifetimeSmoker: boolean;
  isCurrentSmoker: boolean;
  types: ('일반담배' | '궐련형 전자담배' | '액상형 전자담배')[];
  duration: number; // in years
  amountPerDay: number; // number of cigarettes
}

export interface DrinkingHabits {
  frequency: number; // times per week
  avgAmount: number; // glasses per occasion
  maxAmount: number; // max glasses per occasion
}

export interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  gender: '남성' | '여성';
  relation: string; // e.g., '부', '모'
  height: number; // in cm
  chronicConditions?: string; // comma-separated
  geneticRisks?: string; // comma-separated
  smokingHabits: SmokingHabits;
  drinkingHabits: DrinkingHabits;
}

export type HealthMetricType = 'weight' | 'bloodPressure' | 'bloodGlucose';

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface HealthMetricRecord {
  id: string;
  familyMemberId: string;
  type: HealthMetricType;
  value: number | BloodPressure;
  timestamp: string; // ISO 8601
}

export interface Appointment {
  id: string;
  familyMemberId: string;
  hospitalName: string;
  reason: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface CaregiverNote {
  id: string;
  familyMemberId: string;
  author: string;
  note: string;
  timestamp: string; // ISO 8601
}

export interface Vaccination {
  id: string;
  familyMemberId: string;
  name: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
}

export interface HealthCheckup {
  id: string;
  familyMemberId: string;
  name: string; // e.g., '정기 건강검진'
  date: string; // YYYY-MM-DD
  resultSummary: string;
}

export interface Medication {
    id: string;
    familyMemberId: string;
    name: string;
    dosage: string; // e.g., '10mg'
    frequency: string; // e.g., '하루 2번 식후'
    startDate: string; // YYYY-MM-DD
    isActive: boolean;
}

// AI-related types
export interface VaccinationRecommendation {
    familyMemberId: string;
    familyMemberName: string;
    recommendedVaccines: {
        name: string;
        reason: string;
    }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}