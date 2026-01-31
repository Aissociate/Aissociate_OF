import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle2, AlertCircle, X, Download } from 'lucide-react';

interface CSVRow {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  commentaire?: string;
}

interface ProspectsCSVUploadProps {
  onSuccess?: () => void;
}

export default function ProspectsCSVUpload({ onSuccess }: ProspectsCSVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Le fichier CSV doit contenir au moins une ligne d\'en-tête et une ligne de données');
    }

    const headers = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase());

    const prenomIndex = headers.findIndex(h => h.includes('prenom') || h.includes('prénom') || h === 'firstname' || h === 'first_name');
    const nomIndex = headers.findIndex(h => h.includes('nom') && !h.includes('prenom') || h === 'lastname' || h === 'last_name');
    const emailIndex = headers.findIndex(h => h.includes('email') || h.includes('mail'));
    const phoneIndex = headers.findIndex(h => h.includes('tel') || h.includes('phone') || h.includes('mobile'));
    const commentIndex = headers.findIndex(h => h.includes('comment') || h.includes('note') || h.includes('remarque'));

    if (prenomIndex === -1 || nomIndex === -1 || emailIndex === -1 || phoneIndex === -1) {
      throw new Error('Le CSV doit contenir les colonnes: prénom, nom, email, téléphone');
    }

    const rows: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(/[,;]/).map(v => v.trim());

      rows.push({
        prenom: values[prenomIndex] || '',
        nom: values[nomIndex] || '',
        email: values[emailIndex] || '',
        telephone: values[phoneIndex] || '',
        commentaire: commentIndex !== -1 ? values[commentIndex] : '',
      });
    }

    return rows;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setShowPreview(false);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      setPreviewData(data);
      setShowPreview(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la lecture du fichier');
    }
  };

  const handleUpload = async () => {
    if (previewData.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const prospectsToInsert = previewData.map(row => ({
        first_name: row.prenom,
        last_name: row.nom,
        email: row.email,
        phone: row.telephone,
        comment: row.commentaire || null,
        imported_by: user.id,
      }));

      const { error: insertError } = await supabase
        .from('prospects')
        .insert(prospectsToInsert);

      if (insertError) throw insertError;

      setSuccess(`${previewData.length} prospect(s) importé(s) avec succès`);
      setPreviewData([]);
      setShowPreview(false);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'import');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'prenom,nom,email,telephone,commentaire\nJean,Dupont,jean.dupont@example.com,0692123456,Prospect intéressé par la formation IA\nMarie,Martin,marie.martin@example.com,0693234567,A contacter en priorité';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_prospects.csv';
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Import CSV de prospects</h2>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Télécharger le modèle
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Erreur</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Succès</p>
            <p className="text-green-700 text-sm">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Sélectionner un fichier CSV
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-50 file:text-orange-700
              hover:file:bg-orange-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Le CSV doit contenir les colonnes : prénom, nom, email, téléphone, commentaire (optionnel)
        </p>
      </div>

      {showPreview && previewData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Aperçu ({previewData.length} ligne{previewData.length > 1 ? 's' : ''})
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Prénom</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Nom</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Téléphone</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Commentaire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewData.slice(0, 10).map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-900">{row.prenom}</td>
                    <td className="px-4 py-2 text-slate-900">{row.nom}</td>
                    <td className="px-4 py-2 text-slate-600">{row.email}</td>
                    <td className="px-4 py-2 text-slate-600">{row.telephone}</td>
                    <td className="px-4 py-2 text-slate-500">{row.commentaire || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <div className="p-2 bg-slate-50 text-center text-xs text-slate-500">
                ... et {previewData.length - 10} ligne(s) de plus
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                setShowPreview(false);
                setPreviewData([]);
              }}
              disabled={uploading}
              className="px-6 py-2 border-2 border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Importer {previewData.length} prospect{previewData.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
