import React, { useState, useEffect } from 'react';
import { Bot, Code2, Send, Loader2, Sparkles, Github, Layout, Palette, Eye, Download, Copy, Check, Blocks, Wand2, History, Star, Bookmark, Settings } from 'lucide-react';
import { CodePreview } from './components/CodePreview';
import { LivePreview } from './components/LivePreview';
import { useStore } from './store';

type Template = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  baseComponents: string[];
  previewQuery: string;
};

type GeneratedResult = {
  code: string;
  preview: string;
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('landing');
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'live'>('code');
  const [customizations, setCustomizations] = useState({
    colorScheme: 'blue',
    layout: 'modern',
    components: ['header', 'hero', 'features', 'footer'],
    animations: true,
    responsive: true,
    darkMode: false,
    seo: true,
  });
  const [copied, setCopied] = useState(false);
  
  const { 
    addToHistory, 
    addRecentPrompt, 
    toggleFavorite, 
    favorites,
    history 
  } = useStore();

  const templates: Template[] = [
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Perfect for product launches and marketing',
      icon: <Layout className="w-6 h-6" />,
      baseComponents: ['header', 'hero', 'features', 'cta', 'footer'],
      previewQuery: 'modern-website-landing-page'
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Admin panels and data visualization',
      icon: <Blocks className="w-6 h-6" />,
      baseComponents: ['sidebar', 'header', 'stats', 'charts', 'tables'],
      previewQuery: 'dashboard-ui-design'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Showcase your work and projects',
      icon: <Palette className="w-6 h-6" />,
      baseComponents: ['header', 'about', 'projects', 'skills', 'contact'],
      previewQuery: 'portfolio-website-minimal'
    }
  ];

  const generateComponent = (type: string, colorScheme: string) => {
    const components: { [key: string]: string } = {
      header: `
  <header className="bg-${colorScheme}-500 text-white">
    <nav className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Logo</div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-${colorScheme}-200">Home</a>
          <a href="#" className="hover:text-${colorScheme}-200">Features</a>
          <a href="#" className="hover:text-${colorScheme}-200">Pricing</a>
          <a href="#" className="hover:text-${colorScheme}-200">Contact</a>
        </div>
      </div>
    </nav>
  </header>`,
      hero: `
  <section className="bg-${colorScheme}-50 py-20">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Our Platform</h1>
      <p className="text-xl text-gray-600 mb-8">Transform your business with our innovative solutions</p>
      <button className="bg-${colorScheme}-500 text-white px-8 py-3 rounded-lg hover:bg-${colorScheme}-600">
        Get Started
      </button>
    </div>
  </section>`,
      features: `
  <section className="py-20">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-${colorScheme}-500 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
          <p className="text-gray-600">Experience blazing fast performance</p>
        </div>
        {/* More feature cards */}
      </div>
    </div>
  </section>`,
      footer: `
  <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4">About Us</h4>
          <p className="text-gray-400">Your trusted partner in web solutions</p>
        </div>
        {/* More footer content */}
      </div>
    </div>
  </footer>`,
    };

    return components[type] || '';
  };

  const generateWebsite = (template: Template, customizations: any, prompt: string) => {
    const components = customizations.components
      .map(comp => generateComponent(comp, customizations.colorScheme))
      .join('\n');

    return `import React from 'react';

export default function ${template.name.replace(/\s+/g, '')}() {
  // Generated based on prompt: ${prompt}
  return (
    <div className="min-h-screen bg-${customizations.colorScheme}-50">
      ${components}
    </div>
  );
}`;
  };

  const getPreviewUrl = (template: Template) => {
    const query = encodeURIComponent(template.previewQuery);
    return `https://source.unsplash.com/1920x1080/?${query}`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const selectedTemplateObj = templates.find(t => t.id === selectedTemplate)!;
      
      // Generate the website code
      const code = generateWebsite(selectedTemplateObj, customizations, prompt);
      
      // Add to history and recent prompts
      addToHistory({
        prompt,
        code,
        template: selectedTemplate,
      });
      addRecentPrompt(prompt);
      
      // Set the result with both code and a preview image
      setGeneratedResult({
        code,
        preview: getPreviewUrl(selectedTemplateObj)
      });
    } catch (error) {
      console.error('Error generating website:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (generatedResult) {
      await navigator.clipboard.writeText(generatedResult.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedResult) {
      const blob = new Blob([generatedResult.code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate}-template.jsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-700 sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">WebGen AI</span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Wand2 className="w-5 h-5" />
                <span>Templates</span>
              </a>
              <a
                href="https://github.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Generate Beautiful Websites with AI
            </h1>
            <p className="text-xl text-gray-400">
              Transform your ideas into production-ready websites in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setCustomizations(prev => ({
                    ...prev,
                    components: template.baseComponents
                  }));
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400">{template.icon}</div>
                  <div className="text-left">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Customization</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color Scheme
                </label>
                <select
                  value={customizations.colorScheme}
                  onChange={(e) => setCustomizations(prev => ({...prev, colorScheme: e.target.value}))}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="green">Green</option>
                  <option value="rose">Rose</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Layout Style
                </label>
                <select
                  value={customizations.layout}
                  onChange={(e) => setCustomizations(prev => ({...prev, layout: e.target.value}))}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="classic">Classic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Components
                </label>
                <select
                  multiple
                  value={customizations.components}
                  onChange={(e) => setCustomizations(prev => ({
                    ...prev,
                    components: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                >
                  <option value="header">Header</option>
                  <option value="hero">Hero Section</option>
                  <option value="features">Features</option>
                  <option value="testimonials">Testimonials</option>
                  <option value="pricing">Pricing</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Advanced Features
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customizations.animations}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        animations: e.target.checked
                      }))}
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">Animations</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customizations.darkMode}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        darkMode: e.target.checked
                      }))}
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">Dark Mode</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customizations.seo}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        seo: e.target.checked
                      }))}
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">SEO Optimization</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-grow">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your website in detail... (e.g., 'Create a modern landing page for a SaaS product with a hero section, feature grid, and testimonials')"
                  className="w-full h-32 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors
                  ${isGenerating || !prompt
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                  }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedResult && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="border-b border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === 'code' ? 'bg-blue-500' : 'hover:bg-gray-700'
                      }`}
                    >
                      <Code2 className="w-5 h-5" />
                      <span>Code</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === 'preview' ? 'bg-blue-500' : 'hover:bg-gray-700'
                      }`}
                    >
                      <Eye className="w-5 h-5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('live')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === 'live' ? 'bg-blue-500' : 'hover:bg-gray-700'
                      }`}
                    >
                      <Blocks className="w-5 h-5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(generatedResult.code)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        favorites.includes(generatedResult.code)
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <Star className="w-5 h-5" />
                      <span>Favorite</span>
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {activeTab === 'code' ? (
                  <CodePreview code={generatedResult.code} />
                ) : activeTab === 'preview' ? (
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={generatedResult.preview}
                      alt="Generated website preview"
                      className="w-full h-auto"
                      loading="eager"
                    />
                  </div>
                ) : (
                  <LivePreview code={generatedResult.code} />
                )}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <History className="w-5 h-5 mr-2" />
                Recent Generations
              </h2>
              <div className="grid gap-4">
                {history.slice(0, 5).map((entry, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      <span className="text-sm text-blue-400">{entry.template}</span>
                    </div>
                    <p className="text-gray-300">{entry.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
                title: 'AI-Powered',
                description: 'Advanced AI models to understand your requirements and generate pixel-perfect websites',
              },
              {
                icon: <Code2 className="w-6 h-6 text-green-400" />,
                title: 'Production Ready',
                description: 'Generate clean, maintainable code with modern best practices and optimizations',
              },
              {
                icon: <Palette className="w-6 h-6 text-purple-400" />,
                title: 'Customizable',
                description: 'Fine-tune every aspect of your generated website with powerful customization options',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;