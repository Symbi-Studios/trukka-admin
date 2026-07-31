'use client'

import { ChevronDown, Plus, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  getTemplatesAction, 
  createTemplateAction, 
  updateTemplateAction, 
  deleteTemplateAction 
} from "@/app/actions/support";

// Helper for category colors
const getCategoryStyles = (category: string) => {
  const c = (category || '').toUpperCase();
  if (c === 'DELAY') return 'bg-amber-50 text-amber-600 border-amber-200';
  if (c === 'DOCS') return 'bg-blue-50 text-blue-600 border-blue-200';
  if (c === 'PAYMENT') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  return 'bg-slate-50 text-slate-600 border-slate-200'; // GENERAL
};

export const TemplatesTab = () => {
  // Data State
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection & Form State
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [body, setBody] = useState('');
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All'); // 'All', 'DELAY', 'DOCS', 'PAYMENT', 'GENERAL'

  // Action States
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    // If 'All' is selected, we don't pass a category to the API
    const catParam = activeCategoryFilter === 'All' ? undefined : activeCategoryFilter;
    const res = await getTemplatesAction(catParam);
    
    if (res.success && res.data) {
      setTemplates(res.data.templates || res.data || []);
      // If we don't have a selected template, default to the first one (if it exists)
      if (!selectedTemplate && res.data.length > 0) {
        handleSelectTemplate(res.data[0]);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, [activeCategoryFilter]);

  // Handle selecting a template to edit
  const handleSelectTemplate = (t: any) => {
    setSelectedTemplate(t);
    setTitle(t.title || '');
    setCategory(t.category || 'GENERAL');
    setBody(t.body || '');
  };

  // Handle preparing to create a new template
  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setTitle('');
    setCategory('GENERAL');
    setBody('');
  };

  // Create or Update
  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      alert("Title and Message body are required.");
      return;
    }

    setIsSaving(true);
    const payload = { title, body, category };

    if (selectedTemplate) {
      // Update existing
      const res = await updateTemplateAction(selectedTemplate.id, payload);
      if (res.success) {
        alert("Template updated successfully!");
        fetchTemplates();
      } else {
        alert("Failed to update template.");
      }
    } else {
      // Create new
      const res = await createTemplateAction(payload);
      if (res.success) {
        alert("Template created successfully!");
        fetchTemplates();
        handleNewTemplate(); // clear form
      } else {
        alert("Failed to create template.");
      }
    }
    setIsSaving(false);
  };

  // Delete
  const handleDelete = async () => {
    if (!selectedTemplate) return;
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    setIsDeleting(true);
    const res = await deleteTemplateAction(selectedTemplate.id);
    if (res.success) {
      alert("Template deleted!");
      handleNewTemplate(); // clear form
      fetchTemplates(); // refresh list
    } else {
      alert("Failed to delete template.");
    }
    setIsDeleting(false);
  };

  // Local search filtering
  const filteredTemplates = templates.filter(t => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.body?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['All', 'DELAY', 'DOCS', 'PAYMENT', 'GENERAL'];

  return (
    <div className="flex gap-6 items-start h-[calc(100vh-280px)] min-h-150">
      
      {/* Left: Template List */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-900">All templates</h2>
          {/* <button 
            onClick={handleNewTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> New template
          </button> */}
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-lg p-2 focus-within:border-blue-500 transition-colors">
            <Search size={16} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..." 
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {categories.map(cat => (
              <span 
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full cursor-pointer transition-colors whitespace-nowrap ${
                  activeCategoryFilter === cat 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center text-slate-500 py-10 text-sm">No templates found.</div>
          ) : (
            filteredTemplates.map((t) => (
              <div 
                key={t.id} 
                onClick={() => handleSelectTemplate(t)}
                className={`bg-white border rounded-xl p-5 cursor-pointer transition-colors ${
                  selectedTemplate?.id === t.id 
                    ? 'border-blue-400 bg-blue-50/20 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border mb-2 inline-block ${getCategoryStyles(t.category)}`}>
                  {t.category ? t.category.charAt(0) + t.category.slice(1).toLowerCase() : 'General'}
                </span>
                <h4 className="font-bold text-slate-900 mb-1">{t.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{t.body}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Edit / Create Template */}
      <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-slate-900">
            {selectedTemplate ? 'Edit template' : 'Create template'}
          </h2>
          <div className="flex gap-3">
            {selectedTemplate && (
              <button 
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving || isDeleting || !title || !body}
              className="px-4 py-2 text-sm font-bold text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {selectedTemplate ? 'Save template' : 'Create template'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Template name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. General delivery delay" 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Category <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 appearance-none bg-white"
              >
                <option value="GENERAL">General</option>
                <option value="DELAY">Delay</option>
                <option value="DOCS">Docs</option>
                <option value="PAYMENT">Payment</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Message body <span className="text-red-500">*</span></label>
            <textarea 
              rows={8} 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the template message here..." 
              className="w-full border border-slate-200 rounded-lg p-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>

    </div>
  );
};