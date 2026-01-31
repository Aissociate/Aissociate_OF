import { Edit2, Phone, Mail, Calendar, Building2, Bell } from 'lucide-react';
import { Dossier, getStatusLabel, getStatusColor, getFullName } from '../../types/dossiers';
import { formatDate, formatDateTime } from '../../utils/kpiCalculations';

interface DossierListProps {
  dossiers: Dossier[];
  onEdit: (dossier: Dossier) => void;
  role: 'fixer' | 'closer' | 'admin';
}

export default function DossierList({ dossiers, onEdit, role }: DossierListProps) {
  if (dossiers.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 font-semibold">Aucun dossier trouvé</p>
        <p className="text-slate-500 text-sm mt-2">Créez votre premier dossier pour commencer</p>
      </div>
    );
  }

  if (role === 'fixer') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Prénom</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Entreprise</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Contact Téléphone</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Commentaire</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Date d'entrée</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Prochaine Action</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Objectif</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dossiers.map(dossier => (
              <tr key={dossier.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-900">{dossier.contact_last_name}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">{dossier.contact_first_name}</div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="font-semibold text-slate-900">{dossier.company}</div>
                    {dossier.sector && (
                      <div className="text-xs text-slate-500">{dossier.sector}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {dossier.phone ? (
                    <a href={`tel:${dossier.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {dossier.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-4 py-4 max-w-xs">
                  {dossier.fixer_notes ? (
                    <div className="text-sm text-slate-700 line-clamp-2" title={dossier.fixer_notes}>
                      {dossier.fixer_notes}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-slate-900">{formatDate(dossier.created_at)}</div>
                </td>
                <td className="px-4 py-4">
                  {dossier.next_step_date ? (
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                      <Calendar className="w-3 h-3 text-blue-600" />
                      <span>{formatDate(dossier.next_step_date)}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-4 py-4 max-w-xs">
                  {dossier.next_step_action ? (
                    <div className="text-sm text-slate-700 line-clamp-2" title={dossier.next_step_action}>
                      {dossier.next_step_action}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onEdit(dossier)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-100 border-b-2 border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Entreprise</th>
            {role === 'closer' && (
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Produit</th>
            )}
            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Contact</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Statut</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">RDV</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Show-up</th>
            {role === 'closer' && (
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Qualité</th>
            )}
            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Dernière activité</th>
            <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {dossiers.map(dossier => (
            <tr key={dossier.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4">
                <div>
                  <div className="font-bold text-slate-900">{dossier.company}</div>
                  {dossier.sector && (
                    <div className="text-xs text-slate-500">{dossier.sector}</div>
                  )}
                </div>
              </td>
              {role === 'closer' && (
                <td className="px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    dossier.product_type === 'marche_public'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {dossier.product_type === 'marche_public' ? 'Marché Public' : 'Formations IA'}
                  </span>
                </td>
              )}
              <td className="px-4 py-4">
                <div>
                  <div className="font-semibold text-slate-900">{getFullName(dossier)}</div>
                  {dossier.contact_function && (
                    <div className="text-xs text-slate-500">{dossier.contact_function}</div>
                  )}
                  <div className="flex gap-2 mt-1">
                    {dossier.phone && (
                      <a href={`tel:${dossier.phone}`} className="text-blue-600 hover:text-blue-700">
                        <Phone className="w-3 h-3" />
                      </a>
                    )}
                    {dossier.email && (
                      <a href={`mailto:${dossier.email}`} className="text-blue-600 hover:text-blue-700">
                        <Mail className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dossier.status)}`}>
                    {getStatusLabel(dossier.status)}
                  </span>
                  {dossier.is_rappel && (
                    <div className="flex items-center gap-1 text-orange-600" title={`Rappel prévu: ${dossier.rappel_date ? formatDateTime(dossier.rappel_date) : 'Date non définie'}`}>
                      <Bell className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {dossier.dispute && (
                  <div className="mt-1 text-xs text-red-600 font-bold">⛔ Litige</div>
                )}
                {dossier.paid && !dossier.dispute && (
                  <div className="mt-1 text-xs text-emerald-600 font-bold">✓ Encaissé</div>
                )}
                {dossier.is_rappel && dossier.rappel_notes && (
                  <div className="mt-1 text-xs text-orange-600 italic line-clamp-1" title={dossier.rappel_notes}>
                    {dossier.rappel_notes}
                  </div>
                )}
              </td>
              <td className="px-4 py-4">
                {dossier.rdv_date ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{formatDate(dossier.rdv_date)}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">-</span>
                )}
              </td>
              <td className="px-4 py-4">
                {dossier.show_up === true && (
                  <span className="text-emerald-600 font-bold text-sm">✓ Oui</span>
                )}
                {dossier.show_up === false && (
                  <span className="text-red-600 font-bold text-sm">✗ Non</span>
                )}
                {dossier.show_up === null && (
                  <span className="text-slate-400 text-sm">-</span>
                )}
              </td>
              {role === 'closer' && (
                <td className="px-4 py-4">
                  {dossier.lead_quality !== null ? (
                    <span className={`font-bold ${dossier.lead_quality >= 7 ? 'text-emerald-600' : dossier.lead_quality >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                      {dossier.lead_quality}/10
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </td>
              )}
              <td className="px-4 py-4 text-sm text-slate-600">
                {formatDate(dossier.last_activity)}
              </td>
              <td className="px-4 py-4 text-center">
                <button
                  onClick={() => onEdit(dossier)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
