import { useState, useEffect, useCallback } from 'react';
import TemplateCard from '../components/templates/TemplateCard';
import TemplateForm from '../components/templates/TemplateForm';
import VariantEditor from '../components/templates/VariantEditor';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useToast } from '../components/layout/Toast';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  cloneTemplate,
  deleteTemplate,
} from '../services/templateService';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showVariantEditor, setShowVariantEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const showToast = useToast();

  // Fetch templates from backend
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTemplates();
      // Handle possible data nesting
      const data = res.data || res;
      setTemplates(data.templates || data || []);
    } catch (err) {
      showToast('error', 'Failed to load templates', err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Create or update template basic info (no variants)
  const handleFormSave = async ({ name, category, showQR }) => {
    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate._id, { name, category, showQR });
        showToast('success', 'Updated', `Template "${name}" updated.`);
      } else {
        // When creating a new template, always supply a default variant with a body
        await createTemplate({
          name,
          category,
          showQR,
          variants: [
            {
              label: 'Default',
              body: 'Hi {{1}}, your pass for {{2}} on {{3}} is ready.',
              active: true,
            },
          ],
        });
        showToast('success', 'Created', `Template "${name}" created.`);
      }
      fetchTemplates();
    } catch (err) {
      showToast('error', 'Save failed', err.response?.data?.message || err.message);
    }
    setShowForm(false);
  };

  // Open variant editor for a template
  const handleEditVariants = (template) => {
    setSelectedTemplate(template);
    setShowVariantEditor(true);
  };

  // Save variants to the backend
  const handleSaveVariants = async (variants) => {
    try {
      await updateTemplate(selectedTemplate._id, { variants });
      showToast('success', 'Variants Saved', `Variants updated.`);
      fetchTemplates();
    } catch (err) {
      showToast('error', 'Save variants failed', err.message);
    }
    setShowVariantEditor(false);
  };

  // Clone a template via API
  const handleClone = async (id) => {
    try {
      await cloneTemplate(id);
      showToast('success', 'Cloned', `Template duplicated.`);
      fetchTemplates();
    } catch (err) {
      showToast('error', 'Clone failed', err.message);
    }
  };

  // Delete a template
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTemplate(deleteId);
      showToast('success', 'Deleted', `Template removed.`);
      fetchTemplates();
    } catch (err) {
      showToast('error', 'Delete failed', err.message);
    }
    setDeleteId(null);
  };

  // UI state: search, category filter, view
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter templates locally
  const filtered = templates.filter((t) => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <i className="fas fa-spinner fa-pulse text-3xl text-gray-400"></i>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <i className="fas fa-file-alt text-orange-500"></i> Message Templates
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  view === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <i className="fas fa-th-large mr-1"></i>Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  view === 'list' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <i className="fas fa-list mr-1"></i>List
              </button>
            </div>
            <Button
              icon="plus"
              onClick={() => {
                setSelectedTemplate(null);
                setShowForm(true);
              }}
            >
              New Template
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              categoryFilter === 'all' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter('delivery')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              categoryFilter === 'delivery' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-ticket-alt"></i> Delivery
          </button>
          <button
            onClick={() => setCategoryFilter('reminder')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              categoryFilter === 'reminder' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-clock"></i> Reminder
          </button>
          <button
            onClick={() => setCategoryFilter('thanks')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              categoryFilter === 'thanks' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-envelope-open-text"></i> Thanks
          </button>
          <button
            onClick={() => setCategoryFilter('custom')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              categoryFilter === 'custom' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-sliders-h"></i> Custom
          </button>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-48 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
          />
        </div>

        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filtered.map((tpl) => (
            <TemplateCard
              key={tpl._id || tpl.id}
              template={tpl}
              onEdit={() => handleEditVariants(tpl)}
              onClone={handleClone}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-10">
              No templates found
            </div>
          )}
        </div>
      </div>

      {/* Template Form Modal (name, category, QR toggle) */}
      <TemplateForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleFormSave}
        initialData={selectedTemplate}
      />

      {/* Variant Editor Modal */}
      <Modal
        isOpen={showVariantEditor}
        onClose={() => setShowVariantEditor(false)}
        title={`Edit Variants - ${selectedTemplate?.name}`}
        size="max-w-3xl"
      >
    {selectedTemplate && (
  <VariantEditor
    variants={selectedTemplate.variants}
    onSave={handleSaveVariants}
    onCancel={() => setShowVariantEditor(false)}
  />
)}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Template?"
      >
        <p className="text-sm text-gray-500 mt-2">
          This will permanently delete the template and its variants.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}