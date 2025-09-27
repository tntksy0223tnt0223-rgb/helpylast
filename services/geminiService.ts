import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { FamilyMember, CaregiverNote, HealthMetricRecord, VaccinationRecommendation, ChatMessage, BloodPressure, Appointment } from "../types";

// Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const formatMetricValue = (value: number | BloodPressure): string => {
    if (typeof value === 'number') {
        return value.toString();
    }
    return `${value.systolic}/${value.diastolic}`;
};

export const getVaccinationRecommendations = async (familyMembers: FamilyMember[]): Promise<VaccinationRecommendation[]> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is not set.");
    return [];
  }
  if (familyMembers.length === 0) {
    return [];
  }

  const prompt = `
    다음은 한 가족 구성원들의 건강 정보입니다. 각 구성원의 나이, 성별, 기존 질환을 바탕으로, 대한민국 질병관리청 가이드라인에 따라 향후 1년 동안 권장되는 예방접종 목록을 생성해주세요.
    결과는 아래에 명시된 JSON 스키마를 엄격히 따라야 합니다. 각 접종에 대한 간단한 추천 사유를 포함해주세요.
    
    가족 정보:
    ${familyMembers.map(m => `
      - 이름: ${m.name}
      - 아이디: ${m.id}
      - 나이: ${getAge(m.birthDate)}세
      - 성별: ${m.gender}
      - 관계: ${m.relation}
      - 기존 질환: ${m.chronicConditions || '없음'}
      - 유전 질환: ${m.geneticRisks || '없음'}
    `).join('')}

    필수 권장 접종이 없는 경우, recommendedVaccines 배열을 비워두세요.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              familyMemberId: { type: Type.STRING },
              familyMemberName: { type: Type.STRING },
              recommendedVaccines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ['name', 'reason'],
                },
              },
            },
            required: ['familyMemberId', 'familyMemberName', 'recommendedVaccines'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as VaccinationRecommendation[];

  } catch (error) {
    console.error("Error fetching vaccination recommendations from Gemini:", error);
    throw new Error("AI 예방접종 계획 생성에 실패했습니다.");
  }
};


export const getComprehensiveHealthAnalysis = async (
  member: FamilyMember,
  notes: CaregiverNote[],
  metrics: HealthMetricRecord[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const sortedMetrics = [...metrics].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const prompt = `
    다음은 "${member.name}"님의 건강 데이터입니다. 이 정보를 바탕으로 종합적인 건강 분석 리포트를 생성해주세요.
    리포트는 이해하기 쉬운 언어로 작성되어야 하며, 잠재적 건강 위험 신호, 긍정적인 점, 그리고 생활 습관 개선을 위한 구체적인 제안을 포함해야 합니다.
    특히 건강 지표의 '변화 추세'를 분석에 반드시 포함해주세요.
    분석은 전문가의 의학적 진단을 대체할 수 없다는 점을 명확히 밝혀주세요.

    **개인 정보:**
    - 이름: ${member.name}
    - 나이: ${getAge(member.birthDate)}세
    - 성별: ${member.gender}
    - 키: ${member.height}cm
    - 기저 질환: ${member.chronicConditions || '없음'}
    - 유전 질환 위험: ${member.geneticRisks || '없음'}
    - 음주 습관: 주 ${member.drinkingHabits.frequency}회, 평균 ${member.drinkingHabits.avgAmount}잔, 최대 ${member.drinkingHabits.maxAmount}잔
    - 흡연 습관: ${member.smokingHabits.isCurrentSmoker ? `현재 흡연 (${member.smokingHabits.types.join(', ')}), ${member.smokingHabits.duration}년간 하루 ${member.smokingHabits.amountPerDay}개비` : '현재 비흡연'}. 평생 5갑 이상 흡연: ${member.smokingHabits.lifetimeSmoker ? '예' : '아니오'}

    **건강 지표 기록 (시간순):**
    ${sortedMetrics.length > 0 ? sortedMetrics.map(m => `- ${new Date(m.timestamp).toLocaleDateString()} ${m.type === 'bloodPressure' ? '혈압' : m.type === 'bloodGlucose' ? '혈당' : '체중'}: ${formatMetricValue(m.value)}`).join('\n') : '기록된 건강 지표가 없습니다.'}

    **최근 요양사 노트:**
    ${notes.length > 0 ? notes.map(n => `- ${new Date(n.timestamp).toLocaleDateString()}: ${n.note}`).join('\n') : '기록된 노트가 없습니다.'}

    **분석 리포트 형식:**
    1.  **건강 상태 요약:** 전반적인 건강 상태에 대한 간략한 요약.
    2.  **주요 관찰 사항:** 건강 지표의 변화 추세, 생활 습관, 노트 내용을 종합하여 발견된 긍정적이거나 우려되는 점.
    3.  **건강 증진 제안:** 식단, 운동, 생활 습관 등 구체적인 개선 제안.
    4.  **주의사항:** 이 분석은 참고용이며, 정확한 진단은 전문 의료진과 상담해야 함을 명시.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching health analysis from Gemini:", error);
    throw new Error("AI 건강 분석 리포트 생성에 실패했습니다.");
  }
};

export const getChatbotResponse = async (
  member: FamilyMember | null,
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
  }));

  const contents = [
      ...formattedHistory,
      { role: 'user' as const, parts: [{ text: newMessage }] }
  ];

  const systemInstruction = member
    ? `당신은 가족 건강 관리 앱의 친절하고 지식이 풍부한 AI 건강 챗봇입니다. 당신은 현재 "${member.name}"(${getAge(member.birthDate)}세, ${member.gender})님에 대한 질문에 답변하고 있습니다.
    사용자의 질문에 명확하고 공감적으로 답변하세요. 다음 건강 데이터를 참고할 수 있지만, 당신의 답변은 의학적 조언을 대체할 수 없음을 항상 명시하세요.
    - 기저 질환: ${member.chronicConditions || '없음'}
    - 유전 위험: ${member.geneticRisks || '없음'}
    - 생활 습관: 흡연(${member.smokingHabits.isCurrentSmoker ? '예' : '아니오'}), 음주(주 ${member.drinkingHabits.frequency}회)
    복잡한 의학 용어는 피하고, 이해하기 쉽게 설명해주세요.`
    : `당신은 가족 건강 관리 앱의 친절하고 지식이 풍부한 AI 건강 챗봇입니다.
    사용자의 일반적인 건강 관련 질문에 명확하고 공감적으로 답변하세요.
    당신의 답변은 의학적 조언을 대체할 수 없으며, 정확한 진단과 치료를 위해서는 반드시 전문 의료진과 상담해야 함을 모든 답변 끝에 명확히 밝혀주세요.
    복잡한 의학 용어는 피하고, 이해하기 쉽게 설명해주세요.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching chatbot response from Gemini:", error);
    throw new Error("AI 챗봇 응답 생성에 실패했습니다.");
  }
};


export const parseAppointmentFromText = async (text: string): Promise<Omit<Appointment, 'id' | 'familyMemberId'>> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    if (!text.trim()) {
        throw new Error("Input text cannot be empty.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const todayStr = formatDate(today);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    const dayAfterTomorrowStr = formatDate(dayAfterTomorrow);

    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const todayDayOfWeek = daysOfWeek[today.getDay()];

    const addAppointmentFunctionDeclaration: FunctionDeclaration = {
        name: 'addAppointment',
        description: '사용자의 텍스트에서 병원 약속 정보를 추출하여 캘린더에 추가합니다.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                hospitalName: {
                    type: Type.STRING,
                    description: '병원 이름',
                },
                reason: {
                    type: Type.STRING,
                    description: '병원 방문 목적 (예: 건강검진, 진료)',
                },
                date: {
                    type: Type.STRING,
                    description: `약속 날짜 (YYYY-MM-DD 형식). "오늘", "내일", "모레", "다음주 월요일", "금요일"과 같은 모든 상대적 날짜 표현을 분석하여 정확한 YYYY-MM-DD 형식으로 변환해야 합니다.`,
                },
                time: {
                    type: Type.STRING,
                    description: '약속 시간 (HH:MM 형식, 24시간 기준). "오후 2시"는 "14:00"으로 변환해야 합니다. "아침 9시 반"은 "09:30"입니다.',
                },
            },
            required: ['hospitalName', 'reason', 'date', 'time'],
        },
    };

    const prompt = `
        사용자의 문장에서 병원 약속 정보를 추출하여 'addAppointment' 함수를 호출해주세요.

        **오늘 날짜**: ${todayStr} (${todayDayOfWeek})

        **날짜 변환 규칙**:
        - **연도**: 연도가 생략된 경우, 현재 날짜(${todayStr})를 기준으로 가장 가까운 미래의 날짜로 가정합니다. 예를 들어, 오늘이 2024-10-25이고 사용자가 "1월 10일"이라고 입력하면, "2025-01-10"으로 해석해야 합니다.
        - **상대적 날짜**:
          - "오늘": ${todayStr}
          - "내일": ${tomorrowStr}
          - "모레": ${dayAfterTomorrowStr}
        - **요일**: 요일만 언급된 경우 (예: "금요일에 예약해줘"), 오늘을 기준으로 가장 가까운 미래의 해당 요일 날짜로 변환해야 합니다.
          - 예시: 오늘이 ${todayStr} (${todayDayOfWeek})일 때, "토요일"은 이번 주 토요일을 의미합니다. 만약 오늘의 요일보다 이전 요일(예: "화요일")을 언급했다면, 다음 주 화요일을 의미합니다.
        - **"다음 주"**: "다음 주 [요일]" 형식은 다음 주의 해당 요일 날짜로 변환합니다.
          - 예시: 오늘이 ${todayStr} (${todayDayOfWeek})일 때, "다음 주 월요일"은 다음 주 월요일의 정확한 날짜로 변환되어야 합니다.
        
        **시간 변환 규칙**:
        - "오전", "아침" 등의 표현을 사용하면 24시간 형식으로 변환합니다. (예: "아침 8시" -> "08:00")
        - "오후", "저녁" 등의 표현을 사용하면 12를 더하여 24시간 형식으로 변환합니다. (예: "오후 3시" -> "15:00", 단 "오후 12시"는 "12:00"입니다.)
        - "반" 이라는 표현은 30분을 의미합니다. (예: "2시 반" -> "14:30")

        **필수 정보**: 날짜, 시간, 병원 이름, 방문 목적이 모두 있어야 함수를 호출할 수 있습니다. 만약 정보가 부족하면 함수를 호출하지 마세요.

        **사용자 입력**: "${text}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [addAppointmentFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall && functionCall.name === 'addAppointment' && functionCall.args) {
             const args = functionCall.args as Omit<Appointment, 'id' | 'familyMemberId'>;
             // Basic validation
             if(args.date && args.hospitalName && args.reason && args.time) {
                // Add more robust date validation
                if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
                     throw new Error("AI가 날짜를 잘못된 형식으로 반환했습니다. YYYY-MM-DD 형식이어야 합니다.");
                }
                return args;
             }
        }
        
        throw new Error("AI가 약속 정보를 추출하지 못했습니다. 날짜, 시간, 병원 이름, 방문 목적을 포함하여 다시 시도해주세요.");

    } catch (error) {
        console.error("Error parsing appointment from text:", error);
        if (error instanceof Error && (error.message.includes('추출하지 못했습니다') || error.message.includes('잘못된 형식'))) {
            throw error;
        }
        throw new Error("AI 일정 분석 중 오류가 발생했습니다.");
    }
};