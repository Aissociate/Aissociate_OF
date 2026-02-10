import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Building2,
  Users,
  Send,
  CheckSquare,
  Square,
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  Package
} from 'lucide-react';
import AdminLogo from '../components/AdminLogo';

interface CompanyRow {
  id: string;
  raison_social: string;
  activite: string;
  city: string;
  postal_code: string;
  dispatch_status: string;
  assigned_to: string | null;
  assigned_at: string | null;
  created_at: string;
  contact_count: number;
  phone_count: number;
  assigned_fixer_email?: string;
}

interface FixerOption {
  id: string;
  email: string;
  full_name: string | null;
}

export default function AdminDispatch() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [fixers, setFixers] = useState<FixerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedFixer, setSelectedFixer] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unassigned' | 'assigned'>('unassigned');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.is_admin) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [profile, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, fixersRes] = await Promise.all([
        supabase
          .from('crm_companies')
          .select('id, raison_social, activite, city, postal_code, dispatch_status, assigned_to, assigned_at, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('role', 'fixer')
          .eq('status', 'active')
          .order('email'),
      ]);

      if (companiesRes.error) throw companiesRes.error;
      if (fixersRes.error) throw fixersRes.error;

      const companyIds = (companiesRes.data || []).map(c => c.id);

      let contactCounts: Record<string, number> = {};
      let phoneCounts: Record<string, number> = {};

      if (companyIds.length > 0) {
        const { data: contacts } = await supabase
          .from('crm_contacts')
          .select('id, company_id')
          .in('company_id', companyIds);

        if (contacts) {
          contactCounts = contacts.reduce((acc, c) => {
            acc[c.company_id] = (acc[c.company_id] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const contactIds = contacts.map(c => c.id);
          if (contactIds.length > 0) {
            const { data: phones } = await supabase
              .from('crm_phones')
              .select('id, contact_id')
              .in('contact_id', contactIds);

            if (phones) {
              const contactToCompany: Record<string, string> = {};
              contacts.forEach(c => { contactToCompany[c.id] = c.company_id; });

              phoneCounts = phones.reduce((acc, p) => {
                const companyId = contactToCompany[p.contact_id];
                if (companyId) acc[companyId] = (acc[companyId] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
            }
          }
        }
      }

      const fixerMap = new Map((fixersRes.data || []).map(f => [f.id, f.email]));

      const enriched: CompanyRow[] = (companiesRes.data || []).map(c => ({
        ...c,
        contact_count: contactCounts[c.id] || 0,
        phone_count: phoneCounts[c.id] || 0,
        assigned_fixer_email: c.assigned_to ? fixerMap.get(c.assigned_to) || '?' : undefined,
      }));

      setCompanies(enriched);
      setFixers(fixersRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c => {
    if (filterStatus === 'unassigned' && c.dispatch_status !== 'unassigned') return false;
    if (filterStatus === 'assigned' && c.dispatch_status === 'unassigned') return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        c.raison_social.toLowerCase().includes(s) ||
        c.city.toLowerCase().includes(s) ||
        c.activite.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)));
    }
  };

  const handleDispatch = async () => {
    if (!selectedFixer || selectedIds.size === 0) return;

    setDispatching(true);
    setError(null);
    setSuccess(null);

    try {
      const ids = Array.from(selectedIds);

      const { error: updateError } = await supabase
        .from('crm_companies')
        .update({
          assigned_to: selectedFixer,
          dispatch_status: 'assigned',
          assigned_at: new Date().toISOString(),
        })
        .in('id', ids);

      if (updateError) throw updateError;

      const fixer = fixers.find(f => f.id === selectedFixer);
      setSuccess(`${ids.length} entreprise(s) assignee(s) a ${fixer?.full_name || fixer?.email}`);
      setSelectedIds(new Set());
      setSelectedFixer('');
      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDispatching(false);
    }
  };

  const stats = {
    total: companies.length,
    unassigned: companies.filter(c => c.dispatch_status === 'unassigned').length,
    assigned: companies.filter(c => c.dispatch_status !== 'unassigned').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <AdminLogo
              src="https://storage.googleapis.com/msgsndr/QgFd2CSdLClLqXBncDm0/media/65f8015e1a9195ba3d84f818.jpeg"
              alt="Aissociate Logo"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dispatch Prospects</h1>
              <p className="text-slate-600">Assignez les entreprises importees aux fixers</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour Admin
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total entreprises</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">{stats.unassigned}</p>
              <p className="text-sm text-slate-500">Non assignees</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{stats.assigned}</p>
              <p className="text-sm text-slate-500">Assignees</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-medium flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm font-medium flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Statut :</span>
            </div>
            <div className="flex gap-2">
              {([
                { key: 'all', label: `Tous (${stats.total})` },
                { key: 'unassigned', label: `Non assignees (${stats.unassigned})` },
                { key: 'assigned', label: `Assignees (${stats.assigned})` },
              ] as const).map(f => (
                <button
                  key={f.key}
                  onClick={() => { setFilterStatus(f.key); setSelectedIds(new Set()); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === f.key
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Rechercher par nom, ville, activite..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-orange-800 font-medium">
                <Send className="w-4 h-4" />
                Assigner {selectedIds.size > 0 ? `${selectedIds.size} entreprise(s)` : 'la selection'} a :
              </div>
              <select
                value={selectedFixer}
                onChange={e => setSelectedFixer(e.target.value)}
                className="flex-1 min-w-[250px] px-4 py-2.5 border-2 border-orange-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">-- Choisir un fixer --</option>
                {fixers.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.full_name || f.email} ({f.email})
                  </option>
                ))}
              </select>
              <button
                onClick={handleDispatch}
                disabled={!selectedFixer || selectedIds.size === 0 || dispatching}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dispatching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Assigner
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left w-10">
                      <button onClick={toggleSelectAll} className="text-slate-500 hover:text-orange-600">
                        {selectedIds.size === filtered.length && filtered.length > 0 ? (
                          <CheckSquare className="w-5 h-5 text-orange-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Raison sociale</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Activite</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Ville</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Contacts</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Tels</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Statut</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Assigne a</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(c => (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedIds.has(c.id) ? 'bg-orange-50' : ''
                      }`}
                      onClick={() => toggleSelect(c.id)}
                    >
                      <td className="px-4 py-3">
                        {selectedIds.has(c.id) ? (
                          <CheckSquare className="w-5 h-5 text-orange-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{c.raison_social}</td>
                      <td className="px-4 py-3 text-slate-600">{c.activite || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {c.city}{c.postal_code ? ` (${c.postal_code})` : ''}
                        {!c.city && '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                          <Users className="w-3 h-3" />
                          {c.contact_count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs text-slate-500">{c.phone_count}</span>
                      </td>
                      <td className="px-4 py-3">
                        {c.dispatch_status === 'unassigned' ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            Non assigne
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Assigne
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {c.assigned_fixer_email || '-'}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                        Aucune entreprise trouvee
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 text-sm text-slate-500">
            {filtered.length} entreprise(s) affichee(s) - {selectedIds.size} selectionnee(s)
          </div>
        </div>
      </div>
    </div>
  );
}
