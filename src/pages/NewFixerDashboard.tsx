import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Filter, LogOut, Calendar, BookOpen } from 'lucide-react';
import AdminLogo from '../components/AdminLogo';
import DossierForm from '../components/dossiers/DossierForm';
import DossierList from '../components/dossiers/DossierList';
import FixerKPIWidget from '../components/dossiers/FixerKPIWidget';
import FixerConsolidatedKPIs from '../components/FixerConsolidatedKPIs';
import { Dossier, DossierStatus, Bonus } from '../types/dossiers';
import { calculateFixerKPIs, calculateBonusEstimate } from '../utils/kpiCalculations';

export default function NewFixerDashboard() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [filteredDossiers, setFilteredDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDossier, setEditingDossier] = useState<Partial<Dossier> | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [kpiPeriod, setKpiPeriod] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [filterNextAction, setFilterNextAction] = useState<'all' | 'today' | 'upcoming' | 'overdue'>('all');
  const [bonus, setBonus] = useState<Bonus | null>(null);

  useEffect(() => {
    if (!profile) return;

    if (profile.status !== 'active') {
      navigate('/dashboard');
      return;
    }

    if (profile.role !== 'fixer') {
      if (profile.role === 'closer') {
        navigate('/onboarding/dashboard/closer', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    loadData();
  }, [profile, navigate]);

  const getDateFilter = (period?: 'all' | 'day' | 'week' | 'month') => {
    const targetPeriod = period || filterPeriod;
    const now = new Date();
    if (targetPeriod === 'day') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay;
    } else if (targetPeriod === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    } else if (targetPeriod === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return startOfMonth;
    }
    return null;
  };

  useEffect(() => {
    let filtered = dossiers;

    const dateFilter = getDateFilter();
    if (dateFilter) {
      filtered = filtered.filter(d => {
        const lastActivity = new Date(d.last_activity);
        return lastActivity >= dateFilter;
      });
    }

    if (filterNextAction !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter(d => {
        if (!d.next_step_date) return false;
        const nextActionDate = new Date(d.next_step_date);
        nextActionDate.setHours(0, 0, 0, 0);

        if (filterNextAction === 'today') {
          return nextActionDate.getTime() === today.getTime();
        } else if (filterNextAction === 'upcoming') {
          return nextActionDate > today;
        } else if (filterNextAction === 'overdue') {
          return nextActionDate < today;
        }
        return true;
      });
    }

    if (filterStatus === 'all') {
      setFilteredDossiers(filtered);
    } else {
      setFilteredDossiers(filtered.filter(d => d.status === filterStatus));
    }
  }, [dossiers, filterStatus, filterPeriod, filterNextAction]);

  const loadData = async () => {
    if (!profile || !profile) return;

    setLoading(true);
    try {
      const [dossiersRes, bonusRes] = await Promise.all([
        supabase
          .from('dossiers')
          .select('*')
          .eq('fixer_id', profile.id)
          .order('last_activity', { ascending: false }),
        supabase
          .from('bonuses')
          .select('*')
          .eq('profile_id', profile.id)
          .eq('active', true)
          .maybeSingle()
      ]);

      if (dossiersRes.error) throw dossiersRes.error;
      if (bonusRes.error) throw bonusRes.error;

      setDossiers(dossiersRes.data || []);
      setBonus(bonusRes.data || {
        id: '',
        profile_id: profile.id,
        tier_1_clients: 5,
        tier_1_amount: 200,
        tier_2_clients: 10,
        tier_2_amount: 500,
        tier_3_clients: 15,
        tier_3_amount: 1000,
        min_show_up_rate: 70,
        min_quality_score: 7,
        active: true,
        created_at: '',
        updated_at: ''
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNewDossier = () => {
    setEditingDossier(null);
    setShowForm(true);
  };

  const handleEditDossier = (dossier: Dossier) => {
    setEditingDossier(dossier);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDossier(null);
  };

  const handleSaveForm = () => {
    setShowForm(false);
    setEditingDossier(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-slate-600">Chargement...</div>
      </div>
    );
  }

  const dateFilter = getDateFilter();
  const kpiDateFilter = getDateFilter(kpiPeriod);
  const dossiersForKPI = kpiDateFilter
    ? dossiers.filter(d => new Date(d.last_activity) >= kpiDateFilter)
    : dossiers;

  const kpis = calculateFixerKPIs(dossiersForKPI);
  const bonusEstimate = bonus ? calculateBonusEstimate(
    kpis.clientsPaid,
    kpis.showUpRate,
    kpis.avgQuality,
    bonus
  ) : { amount: 0, tier: 0, nextTier: null, clientsToNext: 0 };

  const dossiersForStatusCount = dateFilter
    ? dossiers.filter(d => new Date(d.last_activity) >= dateFilter)
    : dossiers;

  const statusCounts = dossiersForStatusCount.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <AdminLogo />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Fixer</h1>
              <p className="text-sm text-slate-600">Bienvenue, {profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/formation')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
            >
              <BookOpen className="w-4 h-4" />
              Formation
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <FixerKPIWidget
            kpis={kpis}
            bonusEstimate={bonusEstimate}
            period={kpiPeriod}
            onPeriodChange={setKpiPeriod}
          />
        </div>

        <div className="mb-6">
          <FixerConsolidatedKPIs profileId={profile?.id || ''} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Dossiers en cours</h2>
              <p className="text-slate-600 text-sm mt-2">
                {dossiers.length} dossier{dossiers.length > 1 ? 's' : ''} au total · {filteredDossiers.length} affichés
              </p>
            </div>
            <button
              onClick={handleNewDossier}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Nouveau dossier
            </button>
          </div>

          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex gap-6 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Période:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterPeriod('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterPeriod === 'all'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilterPeriod('day')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterPeriod === 'day'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setFilterPeriod('week')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterPeriod === 'week'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cette semaine
                </button>
                <button
                  onClick={() => setFilterPeriod('month')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterPeriod === 'month'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Ce mois
                </button>
              </div>
            </div>

            <div className="flex gap-6 items-center flex-wrap mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Prochaine Action:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterNextAction('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterNextAction === 'all'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilterNextAction('today')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterNextAction === 'today'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setFilterNextAction('overdue')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterNextAction === 'overdue'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  En retard
                </button>
                <button
                  onClick={() => setFilterNextAction('upcoming')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    filterNextAction === 'upcoming'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  À venir
                </button>
              </div>
            </div>

            <div className="flex gap-6 items-center flex-wrap mt-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Statut:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Tous ({dossiersForStatusCount.length})
                </button>
                <button
                  onClick={() => setFilterStatus('à_contacter')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === 'à_contacter'
                      ? 'bg-slate-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  À contacter ({statusCounts['à_contacter'] || 0})
                </button>
                <button
                  onClick={() => setFilterStatus('rdv_closer_planifié')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === 'rdv_closer_planifié'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                  }`}
                >
                  RDV planifiés ({statusCounts['rdv_closer_planifié'] || 0})
                </button>
                <button
                  onClick={() => setFilterStatus('encaissé')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === 'encaissé'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Encaissés ({statusCounts['encaissé'] || 0})
                </button>
              </div>
            </div>
          </div>

          <DossierList
            dossiers={filteredDossiers}
            onEdit={handleEditDossier}
            role="fixer"
          />
        </div>
      </main>

      {showForm && (
        <DossierForm
          dossier={editingDossier}
          fixerId={profile?.id || ''}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
          role="fixer"
        />
      )}
    </div>
  );
}
