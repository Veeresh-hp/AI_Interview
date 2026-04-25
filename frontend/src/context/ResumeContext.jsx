import { useState, useCallback, useContext } from 'react';
import { ResumeContext } from './ResumeContextDef';
import { AuthContext } from './AuthContextDef';

export const ResumeProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [template, setTemplate] = useState(null);
    const [hasSelectedLayout, setHasSelectedLayout] = useState(false);
    const [saveStatus, setSaveStatus] = useState('Idle');
    const [showGitHub, setShowGitHub] = useState(false);
    
    const [formData, setFormData] = useState({ 
        name: 'JOHN DOE', 
        title: 'Senior Software Engineer', 
        phone: '+91 8889902000',
        email: 'johndoe@example.com',
        location: 'India',
        linkedin: 'johndoe',
        github: 'johndoe-dev',
        profileImage: null, // Base64 profile image
        summary: 'Experienced software engineer with a strong background in developing scalable web applications and distributed systems. Expert in full-stack development and cloud architecture.',
        education: 'Shri Govindram Institute Of Technology , B.E in Computer Science And Engineering | 2018 – 2022\nGPA: 8.6/10.0',
        skills: 'Languages: JavaScript, TypeScript, Python, Go\nFrontend: React, Vue, Tailwind CSS\nBackend: Node.js, Django, PostgreSQL\nCloud: AWS, Docker, Kubernetes',
        experience: 'Senior Software Engineer | Tech Innovations Inc. | 2022 – Present\n• Led the development of a real-time analytics dashboard with 1M+ daily active users.\n• Optimized database queries, reducing response time by 50%.',
        projects: 'CloudScale - Infrastructure as Code | Go, Terraform\n• Built an automated scaling system for multi-cloud environments.\n\nOpenBridge API | TypeScript, Node.js\n• Developed a highly available API gateway for secure microservices communication.',
        certifications: 'AWS Certified Solutions Architect\nGoogle Professional Cloud Developer'
    });

    const saveResumeData = useCallback(async (status = 'draft') => {
        setSaveStatus('Saving...');
        try {
            const response = await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: `${formData.name ? formData.name.replace(/\s+/g, '_') : 'My'}_Resume.pdf`,
                    structuredData: formData,
                    template: template,
                    status: status,
                    userEmail: user?.email
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            setSaveStatus('Saved');
            setTimeout(() => setSaveStatus('Idle'), 3000);
        } catch (err) {
            console.error("Auto-save failed:", err);
            setSaveStatus('Error');
        }
    }, [formData, template, user?.email]);

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const resetLayout = () => {
        setTemplate(null);
        setHasSelectedLayout(false);
    };

    const selectTemplate = (t) => {
        setTemplate(t);
        setHasSelectedLayout(true);
    };

    const loadResume = (resumeData) => {
        if (!resumeData) return;
        setFormData(resumeData.structuredData || formData);
        setTemplate(resumeData.template || 'executive');
        setHasSelectedLayout(true);
    };

    return (
        <ResumeContext.Provider value={{
            formData, setFormData,
            template, setTemplate,
            hasSelectedLayout, setHasSelectedLayout,
            saveStatus, setSaveStatus,
            showGitHub, setShowGitHub,
            saveResumeData,
            handleChange,
            resetLayout,
            selectTemplate,
            loadResume
        }}>
            {children}
        </ResumeContext.Provider>
    );
};
