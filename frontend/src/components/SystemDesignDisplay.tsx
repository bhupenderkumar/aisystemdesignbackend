import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './SystemDesignDisplay.css';

interface SystemDesignDisplayProps {
    htmlContent: string;
    isLoading?: boolean;
    onGenerateDiagram?: () => void;
    onGenerateQuestions?: () => void;
    diagramHtml?: string;
    questionsHtml?: string;
    isDiagramLoading?: boolean;
    isQuestionsLoading?: boolean;
    onQuestionClick?: (question: string) => void;
}

const SystemDesignDisplay: React.FC<SystemDesignDisplayProps> = ({
    htmlContent,
    isLoading = false,
    onGenerateDiagram,
    onGenerateQuestions,
    diagramHtml,
    questionsHtml,
    isDiagramLoading = false,
    isQuestionsLoading = false,
    onQuestionClick,
}) => {
    const [showDiagram, setShowDiagram] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    if (isLoading) {
        return (
            <div className="system-design-container loading">
                <div className="spinner"></div>
                <p>Generating system design...</p>
            </div>
        );
    }

    if (!htmlContent) {
        return (
            <div className="system-design-container empty">
                <p>No system design generated yet.</p>
            </div>
        );
    }

    const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        ADD_TAGS: ['div', 'h1', 'h2', 'h3', 'h4', 'section', 'p', 'ul', 'ol', 'li', 'code', 'pre'],
        ADD_ATTR: ['class'],
    });

    const sanitizedDiagramHtml = diagramHtml ? DOMPurify.sanitize(diagramHtml, {
        ADD_TAGS: ['div', 'h2', 'h3', 'pre', 'ul', 'li'],
        ADD_ATTR: ['class'],
    }) : '';

    const sanitizedQuestionsHtml = questionsHtml ? DOMPurify.sanitize(questionsHtml, {
        ADD_TAGS: ['div', 'h3', 'button', 'p'],
        ADD_ATTR: ['class'],
    }) : '';

    // Extract and make questions clickable
    const processQuestionsHtml = (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const buttons = doc.querySelectorAll('.question-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (onQuestionClick) {
                    onQuestionClick(button.textContent || '');
                }
            });
        });

        return doc.body.innerHTML;
    };

    return (
        <div className="system-design-container">
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            
            <div className="action-buttons">
                {!showDiagram && onGenerateDiagram && (
                    <button 
                        className="action-button"
                        onClick={() => {
                            setShowDiagram(true);
                            onGenerateDiagram();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 9h6v12H2zM10 3h6v18h-6zM18 15h6v6h-6z"/>
                        </svg>
                        Generate System Diagram
                    </button>
                )}

                {!showQuestions && onGenerateQuestions && (
                    <button 
                        className="action-button"
                        onClick={() => {
                            setShowQuestions(true);
                            onGenerateQuestions();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                        Show Suggested Questions
                    </button>
                )}
            </div>

            {showDiagram && (
                <div className="diagram-section">
                    {isDiagramLoading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Generating diagram...</p>
                        </div>
                    ) : diagramHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: sanitizedDiagramHtml }} />
                    ) : null}
                </div>
            )}

            {showQuestions && (
                <div className="questions-section">
                    {isQuestionsLoading ? (
                        <div className="loading-questions">
                            <div className="spinner"></div>
                            <p>Generating suggested questions...</p>
                        </div>
                    ) : questionsHtml ? (
                        <div dangerouslySetInnerHTML={{ 
                            __html: processQuestionsHtml(sanitizedQuestionsHtml) 
                        }} />
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SystemDesignDisplay;
