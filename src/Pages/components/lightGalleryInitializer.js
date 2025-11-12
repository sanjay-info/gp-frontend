import SimpleLightbox from 'simple-lightbox';
import PDFViewer from './PDFViewer';
import { createRoot } from 'react-dom/client';

export const initializeLightGallery = (pdfUrl) => {
    const modalContent = document.createElement('div');

    // Set styles for modalContent to cover the full viewport
    modalContent.style.width = '90vw'; // Full width of the viewport
    modalContent.style.height = '70vh'; // Full height of the viewport
    modalContent.style.position = 'relative'; // Optional: to enable absolute positioning of child elements
    modalContent.style.overflow = 'hide'; // Prevent overflow

    // Render the PDFViewer component inside the modalContent
    const root = createRoot(modalContent);
    root.render(<PDFViewer pdfUrl={pdfUrl} />);

    SimpleLightbox.open({
        content: modalContent,
        elementClass: 'slbContentEl',
        close: true,
        elementLoadingClass: 'slbLoading',
        // Optionally adjust styles for the lightbox wrapper
        onOpen: (lightbox) => {
            lightbox.wrapper.style.width = '100%';
            lightbox.wrapper.style.height = '100%';
            lightbox.wrapper.style.top = '0';
            lightbox.wrapper.style.left = '0';
        },
    });
};