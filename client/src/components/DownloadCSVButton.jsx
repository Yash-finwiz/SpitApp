// client/src/components/DownloadCSVButton.js
import React from 'react';

const DownloadCSVButton = ({ groupId }) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(`/api/expenses/download-csv?groupId=${groupId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/csv',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download CSV');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expenses.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading CSV:', error);
        }
    };

    return (
        <button onClick={handleDownload}>Download CSV</button>
    );
};

export default DownloadCSVButton;
