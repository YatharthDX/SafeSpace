import React from "react";

const RequestCard = ({ request, onApprove, onReject }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="request-card">
      <div className="request-header">
        <h3>{request.studentName}</h3>
        <span className={`status-badge ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </div>
      
      <div className="request-details">
        <div className="detail-item">
          <span className="label">Date:</span>
          <span className="value">{request.date}</span>
        </div>
        <div className="detail-item">
          <span className="label">Time:</span>
          <span className="value">{request.time}</span>
        </div>
        <div className="detail-item">
          <span className="label">Type:</span>
          <span className="value">{request.type}</span>
        </div>
      </div>

      <div className="request-description">
        <p>{request.description}</p>
      </div>

      <div className="request-actions">
        {request.status === "pending" && (
          <>
            <button 
              className="action-button approve"
              onClick={onApprove}
            >
              Approve
            </button>
            <button 
              className="action-button reject"
              onClick={onReject}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard; 