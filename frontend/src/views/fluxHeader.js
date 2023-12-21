import React from 'react';

const FluxHeader = ({ firstLetter, name, userId, navigate }) => (
  <div className="header-disp d-flex align-items-center">
    <div className="circle">
      <div className="profile2">{firstLetter}</div>
    </div>
    <label className="fw-bold fs-4" style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${userId}`)}>
      {name}
    </label>
    <label className="fw-bold fs-1 font col text-end marg">Image Time</label>
  </div>
);

export default FluxHeader;