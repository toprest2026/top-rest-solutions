
import React from "react";
import { FileText, Upload } from "lucide-react";
import type { SupplierFormData } from "./types";
import { DOCUMENT_TYPES } from "./types";

interface Props {
  form: SupplierFormData;
  onChange: (updates: Partial<SupplierFormData>) => void;
}

const StepDocuments: React.FC<Props> = ({ form, onChange }) => {
  const getDoc = (docType: string) => form.documents.find(d => d.doc_type === docType);

  const handleFileSelect = (docType: string, file: File | null) => {
    const existing = form.documents.filter(d => d.doc_type !== docType);
    if (file) {
      existing.push({ doc_type: docType, file, file_url: '' });
    }
    onChange({ documents: existing });
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-xl p-3 mb-2">
        <p className="text-xs text-muted-foreground font-arabic">📋 المستندات غير ضرورية لاستكمال التسجيل لكنها مطلوبة للاعتماد النهائي. الصيغ المقبولة: PDF أو صور.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {DOCUMENT_TYPES.map(dt => {
          const doc = getDoc(dt.id);
          return (
            <div key={dt.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-arabic text-foreground">{dt.label}</p>
                  {doc?.file && <p className="text-xs text-success mt-0.5">✓ {doc.file.name}</p>}
                </div>
              </div>
              <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-border hover:border-primary text-xs text-muted-foreground hover:text-primary transition-all flex items-center gap-1">
                <Upload className="w-3 h-3" />
                {doc ? 'تغيير' : 'رفع'}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={e => handleFileSelect(dt.id, e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepDocuments;
