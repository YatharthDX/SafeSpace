import React from "react";

const RequestCard = ({ request, onApprove, onReject }) => {
  // Map backend status to frontend display status
  const displayStatus = request.status === "accepted" ? "approved" : request.status;
  console.log("This is request ",request);
  // Change the format of time to HH:MM AM/PM
  const time = request.time.split(":");
  const hours = time[0];
  const minutes = time[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12}:${minutes} ${ampm}`;
  // Change the format of date to MM/DD/YYYY remove ISO format
  const date = request.date.split("T")[0];
  const formattedDate = date.split("-").reverse().join("/");


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "accepted": // Handle backend "accepted" status
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
          {displayStatus}
        </span>
      </div>
      
      <div className="request-details">
        <div className="detail-item">
          <span className="label">Date:</span>
          <span className="value">{formattedDate}</span>
        </div>
        <div className="detail-item">
          <span className="label">Time:</span>
          <span className="value">{formattedTime}</span>
        </div>
        <div className="detail-item">
          <span className="label">Contact No.:</span>
          <span className="value">{request.contact_no}</span>
        </div>
        {request.studentEmail && (
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{request.studentEmail}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="label">Description:</span>
          <span className="value">{request.description}</span>
        </div>
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