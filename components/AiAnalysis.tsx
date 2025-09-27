import React, { useState, useCallback } from 'react';
import { FamilyMember, CaregiverNote, HealthMetricRecord } from '../types';
import { getComprehensiveHealthAnalysis } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Select from './common/Select';
import Icon from './common/Icon';

interface AiAnalysisProps {
  familyMembers: FamilyMember[];
  caregiverNotes: CaregiverNote[];
  healthMetrics: HealthMetricRecord[];
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ familyMembers, caregiverNotes, healthMetrics }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(familyMembers.length > 0 ? familyMembers[0].id : '');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalysis = useCallback(async () => {
    if (!selectedMemberId) {
      setError('분석할 가족 구성원을 선택해주세요.');
      return;
    }
    const selectedMember = familyMembers.find(m => m.id === selectedMemberId);
    if (!selectedMember) {
      setError('선택된 가족 구성원 정보를 찾을 수 없습니다.');
      return;
    }
    setIsAnalysisLoading(true);
    setAnalysisResult('');
    setError('');
    try {
      const memberNotes = caregiverNotes.filter(n => n.familyMemberId === selectedMemberId);
      const memberMetrics = healthMetrics.filter(m => m.familyMemberId === selectedMemberId);
      const result = await getComprehensiveHealthAnalysis(selectedMember, memberNotes, memberMetrics);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsAnalysisLoading(false);
    }
  }, [selectedMemberId, familyMembers, caregiverNotes, healthMetrics]);
  
  return (
    <div className="space-y-8">
      {/* Comprehensive Analysis Section */}
      <Card>
        <h2 className="text-2xl font-bold text-slate-100 mb-6">AI 종합 건강 분석</h2>
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-grow">
            <Select 
              label="분석할 가족 구성원 선택"
              id="member-select"
              value={selectedMemberId}
              onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  setAnalysisResult('');
                  setError('');
              }}
            >
              {familyMembers.length > 0 ? (
                familyMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name} ({member.relation})</option>
                ))
              ) : (
                <option value="" disabled>가족 구성원을 먼저 등록해주세요.</option>
              )}
            </Select>
          </div>
          <Button 
            onClick={handleAnalysis} 
            disabled={isAnalysisLoading || !selectedMemberId}
            className="w-full sm:w-auto"
          >
            {isAnalysisLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>분석 중...</span>
              </div>
            ) : (
               <div className="flex items-center space-x-2">
                 <Icon name="sparkles" className="w-5 h-5"/>
                 <span>종합 분석 받기</span>
               </div>
            )}
          </Button>
        </div>
      
        {error && (
            <p className="text-center text-red-400 mt-4">{error}</p>
        )}

        {analysisResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-primary-light mb-2">AI 종합 건강 분석 리포트</h3>
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/50 p-4 rounded-lg">
                {analysisResult}
              </div>
            </div>
        )}
      </Card>
    </div>
  );
};

export default AiAnalysis;