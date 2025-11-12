import React, { useEffect, useState } from 'react';
import 'pdfjs-viewer-element';

const isSafari = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('safari') && !userAgent.includes('chrome');
};

const PDFViewer = ({ pdfUrl }) => {
    const [resolvedPdfUrl, setResolvedPdfUrl] = useState('');

    useEffect(() => {
        if (pdfUrl.startsWith('data:application/pdf;base64,')) {
            const byteString = atob(pdfUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            setResolvedPdfUrl(blobUrl); // Set the Blob URL
        }
        else {
            setResolvedPdfUrl(pdfUrl); // Handle normal URLs
        }
    }, [pdfUrl]);

    const safariBrowser = isSafari();

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {safariBrowser ? (
                // Fallback to iframe for Safari
                <iframe src={resolvedPdfUrl} type="application/pdf" style={{ width: '100%', height: '100%' }} />
            ) : (
                // Use pdfjs-viewer-element for non-Safari browsers
                <pdfjs-viewer-element
                    src={resolvedPdfUrl}
                    viewer-path="/pdfjs-4.6.82-dist"
                    use-cors="true"
                    viewer-extra-styles="#toolbarViewerRight,#sidebarToggle { display: none; }"
                    style={{ maxWidth: '100%', height: '100%' }}
                />
            )}
        </div>
    );
};

export default PDFViewer;