

import React, { useState, useMemo } from 'react';
import { mockHospitals } from '../constants';
import Card from './common/Card';
import Input from './common/Input';
import Icon from './common/Icon';

const HospitalFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = useMemo(() => {
    if (!searchTerm) {
      return mockHospitals;
    }
    return mockHospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      {/* Fix: Update text color to match the dark theme. */}
      <h2 className="text-2xl font-bold mb-6 text-slate-100">병원 찾기</h2>
      <div className="mb-6">
        <Input 
          label="병원 이름, 주소, 또는 진료과목으로 검색"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital) => (
            <Card key={hospital.id}>
              {/* Fix: Update text and background colors to match the dark theme of the app. */}
              <h3 className="text-lg font-bold text-primary-light">{hospital.name}</h3>
              <p className="text-sm font-semibold bg-primary/20 text-primary-light inline-block px-2 py-0.5 rounded-full my-2">{hospital.specialty}</p>
              <p className="text-slate-400 text-sm mt-1">{hospital.address}</p>
              <p className="text-slate-400 text-sm mt-1">전화: {hospital.phone}</p>
            </Card>
          ))
        ) : (
          <p className="text-slate-500 col-span-full text-center">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default HospitalFinder;