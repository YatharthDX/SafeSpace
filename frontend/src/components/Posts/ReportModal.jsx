import React, { useState } from 'react';
import { FaFlag } from 'react-icons/fa';

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reportTitle, setReportTitle] = useState('');
  const [reportBody, setReportBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportBody.trim()) {
      alert('Please provide both a title and description for your report.');
      return;
    }
    onSubmit({
      title: reportTitle,
      body: reportBody,
      reportedAuthorId: "", // Placeholder
      reportedAuthorName: "", // Placeholder
      reporterEmail: "", // Placeholder
    });
    setReportTitle('');
    setReportBody('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">
        <div className="report-modal-header">
          <h2>Report Post</h2>
          <button 
            className="report-modal-close" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="report-modal-form">
          <div className="report-modal-input-group">
            <label htmlFor="reportTitle">Report Title</label>
            <input 
              type="text" 
              id="reportTitle"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Briefly describe the issue"
              required
            />
          </div>
          <div className="report-modal-input-group">
            <label htmlFor="reportBody">Description</label>
            <textarea 
              id="reportBody"
              value={reportBody}
              onChange={(e) => setReportBody(e.target.value)}
              placeholder="Provide more details about your report"
              rows={4}
              required
            />
          </div>
          <div className="report-modal-actions">
            <button 
              type="button" 
              className="report-modal-cancel" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="report-modal-submit"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;