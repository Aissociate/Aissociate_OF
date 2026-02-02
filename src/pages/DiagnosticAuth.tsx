import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function DiagnosticAuth() {
  const [status, setStatus] = useState<{
    supabaseConnection: boolean;
    sessionValid: boolean;
    profileAccess: boolean;
    errors: string[];
  }>({
    supabaseConnection: false,
    sessionValid: false,
    profileAccess: false,
    errors: []
  });
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const newStatus = {
      supabaseConnection: false,
      sessionValid: false,
      profileAccess: false,
      errors: [] as string[]
    };

    try {
      // Test 1: Connexion à Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        newStatus.errors.push(`Erreur session: ${sessionError.message}`);
      } else {
        newStatus.supabaseConnection = true;

        if (sessionData.session) {
          newStatus.sessionValid = true;

          // Test 2: Accès au profil
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .maybeSingle();

          if (profileError) {
            newStatus.errors.push(`Erreur profil: ${profileError.message}`);
          } else if (profileData) {
            newStatus.profileAccess = true;
          } else {
            newStatus.errors.push('Aucun profil trouvé');
          }
        }
      }

      // Test 3: Accès public aux profiles
      const { error: publicError } = await supabase
        .from('profiles')
        .select('id')
        .eq('status', 'active')
        .limit(1);

      if (publicError) {
        newStatus.errors.push(`Erreur accès public: ${publicError.message}`);
      }

    } catch (error: any) {
      newStatus.errors.push(`Erreur générale: ${error.message}`);
    }

    setStatus(newStatus);
    setLoading(false);
  };

  const clearAllSessions = async () => {
    setClearing(true);
    try {
      // Déconnecter de Supabase
      await supabase.auth.signOut();

      // Nettoyer le localStorage
      localStorage.clear();

      // Nettoyer le sessionStorage
      sessionStorage.clear();

      // Réexécuter le diagnostic
      await new Promise(resolve => setTimeout(resolve, 1000));
      await runDiagnostic();

      alert('✅ Sessions nettoyées avec succès! Vous pouvez maintenant retourner à la page d\'accueil.');
    } catch (error: any) {
      alert(`❌ Erreur lors du nettoyage: ${error.message}`);
    }
    setClearing(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Diagnostic d'authentification
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Diagnostic en cours...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connexion Supabase */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                {status.supabaseConnection ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">Connexion Supabase</p>
                  <p className="text-sm text-slate-600">
                    {status.supabaseConnection ? 'Connecté' : 'Échec de connexion'}
                  </p>
                </div>
              </div>

              {/* Session valide */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                {status.sessionValid ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">Session utilisateur</p>
                  <p className="text-sm text-slate-600">
                    {status.sessionValid ? 'Session active' : 'Aucune session active'}
                  </p>
                </div>
              </div>

              {/* Accès profil */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                {status.profileAccess ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">Accès au profil</p>
                  <p className="text-sm text-slate-600">
                    {status.profileAccess ? 'Profil accessible' : 'Pas de profil ou non connecté'}
                  </p>
                </div>
              </div>

              {/* Erreurs */}
              {status.errors.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">Erreurs détectées:</h3>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {status.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={runDiagnostic}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Relancer le diagnostic
                </button>

                <button
                  onClick={clearAllSessions}
                  disabled={clearing}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  {clearing ? 'Nettoyage en cours...' : 'Nettoyer toutes les sessions'}
                </button>

                <a
                  href="/"
                  className="block w-full px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-semibold text-center"
                >
                  Retour à l'accueil
                </a>
              </div>

              {/* Informations */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Que faire ?</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Si vous voyez une erreur 403, cliquez sur "Nettoyer toutes les sessions"</li>
                  <li>• Cela supprimera les anciennes sessions en cache</li>
                  <li>• Vous pourrez ensuite vous reconnecter normalement</li>
                  <li>• Si le problème persiste, videz le cache de votre navigateur (Ctrl+Shift+Delete)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
