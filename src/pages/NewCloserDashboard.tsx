import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Calendar, LogOut, BookOpen, ChevronLeft, ChevronRight, Phone, Mail, Building, Users, Clock, Edit, CheckCircle, XCircle, Plus } from 'lucide-react';
import AdminLogo from '../components/AdminLogo';
import CloserDossierForm from '../components/dossiers/CloserDossierForm';
import CreateDossierForm from '../components/dossiers/CreateDossierForm';
import CloserKPIWidget from '../components/dossiers/CloserKPIWidget';
import { Dossier, Bonus, getStatusLabel, getStatusColor, getFullName } from '../types/dossiers';
import { calculateCloserKPIs, calculateBonusEstimate } from '../utils/kpiCalculations';

export default function NewCloserDashboard() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [upcomingRDVs, setUpcomingRDVs] = useState<Dossier[]>([]);
  const [completedDossiers, setCompletedDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDossier, setEditingDossier] = useState<Dossier | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [kpiPeriod, setKpiPeriod] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [bonus, setBonus] = useState<Bonus | null>(null);

  const isAdminViewing = profile?.is_admin;

  useEffect(() => {
    if (!profile) return;

    if (!isAdminViewing) {
      if (profile.status !== 'active') {
        navigate('/dashboard');
        return;
      }

      if (profile.role !== 'closer') {
        if (profile.role === 'fixer') {
          navigate('/onboarding/dashboard/fixer', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      }
    }

    loadData();
  }, [profile, navigate]);

  const getDateFilter = () => {
    const now = new Date();
    if (kpiPeriod === 'day') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay;
    } else if (kpiPeriod === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    } else if (kpiPeriod === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return startOfMonth;
    }
    return null;
  };

  useEffect(() => {
    const upcoming = dossiers.filter(d =>
      d.status === 'rdv_closer_planifié' ||
      (d.status === 'rdv_closer_tenu' && !d.decision)
    ).sort((a, b) => {
      const dateA = a.rdv_closer_date ? new Date(a.rdv_closer_date).getTime() : 0;
      const dateB = b.rdv_closer_date ? new Date(b.rdv_closer_date).getTime() : 0;
      return dateA - dateB;
    });

    const completed = dossiers.filter(d =>
      d.status === 'décision_oui' ||
      d.status === 'décision_non' ||
      d.status === 'formation_planifiée' ||
      d.status === 'formation_réalisée' ||
      d.status === 'attente_encaissement' ||
      d.status === 'encaissé' ||
      d.status === 'litige'
    ).sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());

    setUpcomingRDVs(upcoming);
    setCompletedDossiers(completed);
  }, [dossiers]);

  const loadData = async () => {
    if (!profile || !profile) return;

    setLoading(true);
    try {
      const [dossiersRes, bonusRes] = await Promise.all([
        supabase
          .from('dossiers')
          .select('*')
          .eq('closer_id', profile.id)
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

  const handlePrevCard = () => {
    setCurrentCardIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextCard = () => {
    setCurrentCardIndex(prev => Math.min(upcomingRDVs.length - 1, prev + 1));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-slate-600">Chargement...</div>
      </div>
    );
  }

  const dateFilter = getDateFilter();
  const dossiersForKPI = dateFilter
    ? dossiers.filter(d => new Date(d.last_activity) >= dateFilter)
    : dossiers;

  const kpis = calculateCloserKPIs(dossiersForKPI);
  const bonusEstimate = bonus ? calculateBonusEstimate(
    kpis.clientsPaid,
    100,
    kpis.avgQuality,
    bonus
  ) : { amount: 0, tier: 0, nextTier: null, clientsToNext: 0 };

  const currentRDV = upcomingRDVs[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <AdminLogo />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Closer</h1>
              <p className="text-sm text-slate-600">Bienvenue, {profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Nouveau dossier
            </button>
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
          <CloserKPIWidget
            kpis={kpis}
            bonusEstimate={bonusEstimate}
            period={kpiPeriod}
            onPeriodChange={setKpiPeriod}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">RDV à Venir</h2>
                <p className="text-slate-600 text-sm mt-1">
                  {upcomingRDVs.length} rendez-vous en attente de traitement
                </p>
              </div>
            </div>
          </div>

          {upcomingRDVs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-500 font-medium">Aucun RDV à venir</p>
              <p className="text-sm text-slate-400 mt-2">Les nouveaux RDV planifiés apparaîtront ici</p>
            </div>
          ) : (
            <>
              <div className="relative">
                {currentRDV && (
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border-2 border-slate-200 p-8 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-3xl font-bold text-slate-900">
                            {getFullName(currentRDV)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(currentRDV.status)}`}>
                            {getStatusLabel(currentRDV.status)}
                          </span>
                        </div>
                        <p className="text-lg text-slate-600">{currentRDV.company}</p>
                      </div>
                      <button
                        onClick={() => handleEditDossier(currentRDV)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                      >
                        <Edit className="w-4 h-4" />
                        Éditer
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                          <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Date du RDV</p>
                            <p className="text-slate-900 font-semibold">{formatDate(currentRDV.rdv_closer_date)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                          <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Téléphone</p>
                            <p className="text-slate-900 font-semibold">{currentRDV.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                          <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-500 font-medium">Email</p>
                            <p className="text-slate-900 font-semibold truncate">{currentRDV.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                          <Building className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Secteur</p>
                            <p className="text-slate-900 font-semibold">{currentRDV.sector}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                          <Users className="w-5 h-5 text-teal-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Taille entreprise</p>
                            <p className="text-slate-900 font-semibold">{currentRDV.size}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Fonction</p>
                            <p className="text-slate-900 font-semibold">{currentRDV.contact_function}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {currentRDV.fixer_notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Notes du Fixer</p>
                        <p className="text-slate-700 whitespace-pre-wrap">{currentRDV.fixer_notes}</p>
                      </div>
                    )}

                    {currentRDV.closer_notes && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-emerald-900 mb-2">Mes notes</p>
                        <p className="text-slate-700 whitespace-pre-wrap">{currentRDV.closer_notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {upcomingRDVs.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className={`p-3 rounded-full transition-all ${
                      currentCardIndex === 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:scale-110'
                    }`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-2">
                    {upcomingRDVs.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentCardIndex(index)}
                        className={`transition-all ${
                          index === currentCardIndex
                            ? 'w-8 h-3 bg-emerald-600 rounded-full'
                            : 'w-3 h-3 bg-slate-300 hover:bg-slate-400 rounded-full'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextCard}
                    disabled={currentCardIndex === upcomingRDVs.length - 1}
                    className={`p-3 rounded-full transition-all ${
                      currentCardIndex === upcomingRDVs.length - 1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:scale-110'
                    }`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              <div className="text-center mt-4 text-sm text-slate-500">
                RDV {currentCardIndex + 1} sur {upcomingRDVs.length}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Dossiers Traités</h2>
              <p className="text-slate-600 text-sm mt-1">
                {completedDossiers.length} dossier{completedDossiers.length > 1 ? 's' : ''} clôturé{completedDossiers.length > 1 ? 's' : ''} ou en cours
              </p>
            </div>
          </div>

          {completedDossiers.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-500 font-medium">Aucun dossier traité</p>
              <p className="text-sm text-slate-400 mt-2">Les dossiers terminés apparaîtront ici</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Entreprise</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Décision</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Qualité</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Montant</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Dernière activité</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completedDossiers.map((dossier) => (
                    <tr
                      key={dossier.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-slate-900">{getFullName(dossier)}</p>
                          <p className="text-sm text-slate-500">{dossier.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-900">{dossier.company}</p>
                        <p className="text-sm text-slate-500">{dossier.sector}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dossier.status)}`}>
                          {getStatusLabel(dossier.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {dossier.decision ? (
                          <div className="flex items-center gap-2">
                            {dossier.decision === 'oui' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="capitalize font-medium">{dossier.decision}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {dossier.lead_quality ? (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-900">{dossier.lead_quality}</span>
                            <span className="text-slate-400">/10</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {dossier.amount > 0 ? (
                          <span className="font-semibold text-emerald-600">{dossier.amount} €</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {formatDateShort(dossier.last_activity)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleEditDossier(dossier)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Edit className="w-3 h-3" />
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showForm && editingDossier && (
        <CloserDossierForm
          dossier={editingDossier}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}

      {showCreateForm && profile && (
        <CreateDossierForm
          closerId={profile.id}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
