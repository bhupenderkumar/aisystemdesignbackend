import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SystemDesignDisplay from '../components/SystemDesignDisplay';
import './SystemDesignContainer.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface SystemDesignContainerProps {
    prompt?: string;
}

const SystemDesignContainer: React.FC<SystemDesignContainerProps> = ({ prompt: initialPrompt }) => {
    const [userId] = useState(() => {
        const stored = localStorage.getItem('userId');
        if (stored) return stored;
        const newId = uuidv4();
        localStorage.setItem('userId', newId);
        return newId;
    });

    const [htmlContent, setHtmlContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [diagramHtml, setDiagramHtml] = useState('');
    const [isDiagramLoading, setIsDiagramLoading] = useState(false);
    const [questionsHtml, setQuestionsHtml] = useState('');
    const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (initialPrompt) {
            generateSystemDesign(initialPrompt);
        }
    }, [initialPrompt]);

    const updateMessages = async (newUserMessage: string) => {
        const updatedMessages = [
            ...messages,
            {
                role: 'user',
                content: newUserMessage,
                timestamp: new Date().toISOString()
            }
        ];
        setMessages(updatedMessages);
        return updatedMessages;
    };

    const generateSystemDesign = async (prompt: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const updatedMessages = await updateMessages(prompt);

            const response = await fetch(`${API_BASE_URL}/api/design/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId,
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate system design');
            }

            const data = await response.json();
            setHtmlContent(data);

            // Add assistant's response to messages
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data,
                    timestamp: new Date().toISOString()
                }
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error generating system design:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateSystemDiagram = async () => {
        setIsDiagramLoading(true);
        setError(null);

        try {
            const updatedMessages = await updateMessages('Generate a system diagram for the current design');

            const response = await fetch(`${API_BASE_URL}/api/design/generate-diagram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId,
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate system diagram');
            }

            const data = await response.json();
            setDiagramHtml(data);

            // Add assistant's response to messages
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data,
                    timestamp: new Date().toISOString()
                }
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error generating system diagram:', err);
        } finally {
            setIsDiagramLoading(false);
        }
    };

    const generateSuggestedQuestions = async () => {
        setIsQuestionsLoading(true);
        setError(null);

        try {
            const updatedMessages = await updateMessages('Generate suggested questions for the current design');

            const response = await fetch(`${API_BASE_URL}/api/design/generate-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId,
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate suggested questions');
            }

            const data = await response.json();
            setQuestionsHtml(data);

            // Add assistant's response to messages
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data,
                    timestamp: new Date().toISOString()
                }
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error generating suggested questions:', err);
        } finally {
            setIsQuestionsLoading(false);
        }
    };

    const handleQuestionClick = (question: string) => {
        generateSystemDesign(question);
    };

    return (
        <div className="system-design-container">
            {error && <div className="error-message">{error}</div>}
            <SystemDesignDisplay
                htmlContent={htmlContent}
                isLoading={isLoading}
                onGenerateDiagram={generateSystemDiagram}
                onGenerateQuestions={generateSuggestedQuestions}
                diagramHtml={diagramHtml}
                questionsHtml={questionsHtml}
                isDiagramLoading={isDiagramLoading}
                isQuestionsLoading={isQuestionsLoading}
                onQuestionClick={handleQuestionClick}
            />
        </div>
    );
};

export default SystemDesignContainer;
