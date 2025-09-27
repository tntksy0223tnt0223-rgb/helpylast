// Implemented the missing CaregiverLog component.

import React, { useState } from 'react';
import { CaregiverNote, FamilyMember } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Select from './common/Select';
import Textarea from './common/Textarea';
import Input from './common/Input';
import Icon from './common/Icon';

interface CaregiverLogProps {
  notes: CaregiverNote[];
  familyMembers: FamilyMember[];
  onAddNote: (note: Omit<CaregiverNote, 'id' | 'timestamp'>) => void;
}

const CaregiverLog: React.FC<CaregiverLogProps> = ({ notes, familyMembers, onAddNote }) => {
  const initialNoteState = {
    familyMemberId: familyMembers.length > 0 ? familyMembers[0].id : '',
    author: '',
    note: '',
  };
  const [newNote, setNewNote] = useState(initialNoteState);
  const [showForm, setShowForm] = useState(false);
  
  const familyMemberMap = new Map(familyMembers.map(m => [m.id, m.name]));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // The name attribute is set to the id in Input and Select components
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.familyMemberId && newNote.author && newNote.note) {
      onAddNote(newNote);
      setNewNote(initialNoteState);
      setShowForm(false);
    }
  };
  
  const sortedNotes = [...notes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">요양사 노트</h2>
        <Button onClick={() => setShowForm(!showForm)}>
            <div className="flex items-center space-x-2">
                <Icon name={showForm ? 'x-mark' : 'plus'} className="w-5 h-5"/>
                <span>{showForm ? '취소' : '새 노트 작성'}</span>
            </div>
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-100">새 노트 작성</h3>
            <Select 
              label="가족 구성원" 
              id="familyMemberId" 
              value={newNote.familyMemberId} 
              onChange={handleInputChange} 
              required
            >
              {familyMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </Select>
            <Input 
              label="작성자" 
              id="author" 
              value={newNote.author} 
              onChange={handleInputChange} 
              required
            />
            <Textarea 
              label="내용" 
              id="note"
              name="note"
              value={newNote.note} 
              onChange={handleInputChange} 
              rows={5}
              placeholder="관찰 내용, 특이사항 등을 기록하세요."
              required
            />
            <div className="flex justify-end">
              <Button type="submit">저장하기</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {sortedNotes.length > 0 ? sortedNotes.map(note => (
          <Card key={note.id}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-primary-light">{familyMemberMap.get(note.familyMemberId) || '알 수 없음'}</h4>
                <p className="text-sm text-slate-400">작성자: {note.author}</p>
              </div>
              <p className="text-xs text-slate-500">{new Date(note.timestamp).toLocaleString('ko-KR')}</p>
            </div>
            <p className="mt-3 text-slate-300 whitespace-pre-wrap">{note.note}</p>
          </Card>
        )) : (
          <Card>
            <p className="text-center text-slate-400">작성된 노트가 없습니다.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaregiverLog;