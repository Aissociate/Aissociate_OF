import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Phone,
  MapPin,
  Briefcase,
  MessageSquare,
  Loader2,
  Inbox,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface CompanyProspect {
  id: string;
  raison_social: string;
  activite: string;
  adresse: string;
  city: string;
  postal_code: string;
  description: string;
  commentaires: string;
  dispatch_status: string;
  contacts: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    commentaires: string;
    phones: { id: string; phone_number: string; label: string }[];
  }[];
}

interface ProspectCardNavigatorProps {
  fixerId: string;
}

export default function ProspectCardNavigator({ fixerId }: ProspectCardNavigatorProps) {
  const [prospects, setProspects] = useState<CompanyProspect[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadProspects = useCallback(async () => {
    setLoading(true);
    try {
      const { data: companies, error: compError } = await supabase
        .from('crm_companies')
        .select('id, raison_social, activite, adresse, city, postal_code, description, commentaires, dispatch_status')
        .eq('assigned_to', fixerId)
        .in('dispatch_status', ['assigned', 'in_progress'])
        .order('assigned_at', { ascending: true });

      if (compError) throw compError;
      if (!companies || companies.length === 0) {
        setProspects([]);
        setLoading(false);
        return;
      }

      const companyIds = companies.map(c => c.id);

      const { data: contacts, error: ctError } = await supabase
        .from('crm_contacts')
        .select('id, company_id, nom, prenom, email, commentaires')
        .in('company_id', companyIds);

      if (ctError) throw ctError;

      let phonesMap: Record<string, { id: string; phone_number: string; label: string }[]> = {};
      if (contacts && contacts.length > 0) {
        const contactIds = contacts.map(c => c.id);
        const { data: phones, error: phError } = await supabase
          .from('crm_phones')
          .select('id, contact_id, phone_number, label')
          .in('contact_id', contactIds);

        if (phError) throw phError;
        if (phones) {
          phonesMap = phones.reduce((acc, p) => {
            if (!acc[p.contact_id]) acc[p.contact_id] = [];
            acc[p.contact_id].push(p);
            return acc;
          }, {} as Record<string, typeof phones>);
        }
      }

      const enriched: CompanyProspect[] = companies.map(c => ({
        ...c,
        contacts: (contacts || [])
          .filter(ct => ct.company_id === c.id)
          .map(ct => ({
            ...ct,
            phones: phonesMap[ct.id] || [],
          })),
      }));

      setProspects(enriched);
      if (currentIndex >= enriched.length) {
        setCurrentIndex(Math.max(0, enriched.length - 1));
      }
    } catch (err) {
      console.error('Error loading prospects:', err);
    } finally {
      setLoading(false);
    }
  }, [fixerId, currentIndex]);

  useEffect(() => {
    loadProspects();
  }, [fixerId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prospects.length, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prospects.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < prospects.length - 1 ? prev + 1 : 0));
  };

  const markStatus = async (status: 'in_progress' | 'completed') => {
    const prospect = prospects[currentIndex];
    if (!prospect) return;

    await supabase
      .from('crm_companies')
      .update({ dispatch_status: status })
      .eq('id', prospect.id);

    if (status === 'completed') {
      const updated = prospects.filter((_, i) => i !== currentIndex);
      setProspects(updated);
      if (currentIndex >= updated.length) setCurrentIndex(Math.max(0, updated.length - 1));
    } else {
      setProspects(prev => prev.map((p, i) =>
        i === currentIndex ? { ...p, dispatch_status: status } : p
      ));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-3" />
        <p className="text-slate-600">Chargement des prospects...</p>
      </div>
    );
  }

  if (prospects.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun prospect assigne</h3>
        <p className="text-slate-500">Vos prospects apparaitront ici une fois assignes par l'admin.</p>
      </div>
    );
  }

  const prospect = prospects[currentIndex];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <Building2 className="w-5 h-5" />
          <h3 className="font-bold text-lg">Prospects CRM</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm font-medium">
            {currentIndex + 1} / {prospects.length}
          </span>
          <div className="flex gap-1">
            {prospects.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-24 bg-gradient-to-r from-white to-transparent flex items-center justify-start pl-2 hover:from-slate-100 transition-colors group"
          title="Precedent (fleche gauche)"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-700 group-hover:text-orange-600" />
          </div>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-24 bg-gradient-to-l from-white to-transparent flex items-center justify-end pr-2 hover:from-slate-100 transition-colors group"
          title="Suivant (fleche droite)"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
            <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-orange-600" />
          </div>
        </button>

        <div className="px-14 py-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{prospect.raison_social}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                prospect.dispatch_status === 'in_progress'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {prospect.dispatch_status === 'in_progress' ? 'En cours' : 'Nouveau'}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {prospect.activite && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {prospect.activite}
                </div>
              )}
              {(prospect.city || prospect.postal_code) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {prospect.adresse && `${prospect.adresse}, `}{prospect.city} {prospect.postal_code}
                </div>
              )}
            </div>

            {prospect.description && (
              <p className="mt-3 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                {prospect.description}
              </p>
            )}

            {prospect.commentaires && (
              <div className="mt-3 flex items-start gap-2 text-sm bg-amber-50 rounded-lg p-3">
                <MessageSquare className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800">{prospect.commentaires}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              Contacts ({prospect.contacts.length})
            </h4>

            {prospect.contacts.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Aucun contact</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prospect.contacts.map(contact => (
                  <div
                    key={contact.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {contact.prenom} {contact.nom}
                        </p>
                        {contact.email && (
                          <p className="text-xs text-slate-500">{contact.email}</p>
                        )}
                      </div>
                    </div>

                    {contact.phones.length > 0 && (
                      <div className="space-y-1.5">
                        {contact.phones.map(phone => (
                          <a
                            key={phone.id}
                            href={`tel:${phone.phone_number}`}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium group"
                            onClick={e => e.stopPropagation()}
                          >
                            <Phone className="w-3.5 h-3.5 group-hover:animate-pulse" />
                            {phone.phone_number}
                            <span className="text-xs text-slate-400 font-normal">({phone.label})</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {contact.commentaires && (
                      <p className="mt-2 text-xs text-slate-500 italic">{contact.commentaires}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-2">
              {prospect.dispatch_status !== 'in_progress' && (
                <button
                  onClick={() => markStatus('in_progress')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Marquer en cours
                </button>
              )}
              <button
                onClick={() => markStatus('completed')}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Marquer termine
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Utilisez les fleches du clavier pour naviguer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
