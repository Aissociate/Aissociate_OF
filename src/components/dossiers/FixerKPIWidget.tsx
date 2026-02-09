import { useState } from 'react';
import { TrendingUp, Target, CheckCircle, Star, Award, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { FixerKPIs } from '../../types/dossiers';
import { formatPercent, formatCurrency } from '../../utils/kpiCalculations';

interface FixerKPIWidgetProps {
  kpis: FixerKPIs;
  bonusEstimate: {
    amount: number;
    tier: number;
    nextTier: number | null;
    clientsToNext: number;
  };
  period: 'all' | 'day' | 'week' | 'month';
  onPeriodChange: (period: 'all' | 'day' | 'week' | 'month') => void;
}

export default function FixerKPIWidget({ kpis, bonusEstimate, period, onPeriodChange }: FixerKPIWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Mes KPIs</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
        {!isExpanded && (
          <div className="flex items-center gap-4 flex-wrap text-sm">
            <span className="text-slate-700"><strong>{kpis.rdvPlanned}</strong> RDV</span>
            <span className="text-slate-700"><strong>{formatPercent(kpis.showUpRate)}</strong> Show-up</span>
            <span className="text-slate-700"><strong>{kpis.clientsPaid}</strong> Encaissés</span>
            <span className="text-emerald-700 font-semibold">{formatCurrency(bonusEstimate.amount)} prime</span>
          </div>
        )}
        {isExpanded && (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-600 font-medium mr-2">Période:</span>
          <div className="flex gap-1">
            <button
              onClick={() => onPeriodChange('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                period === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => onPeriodChange('day')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                period === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => onPeriodChange('week')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                period === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => onPeriodChange('month')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                period === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Mois
            </button>
          </div>
        </div>
        )}
      </div>
      {isExpanded && (
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs text-slate-500">RDV planifiés</span>
              <div className="text-lg font-bold text-slate-900">{kpis.rdvPlanned}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs text-slate-500">Show-up</span>
              <div className="text-lg font-bold text-slate-900">{formatPercent(kpis.showUpRate)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs text-slate-500">Encaissés</span>
              <div className="text-lg font-bold text-slate-900">{kpis.clientsPaid}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs text-slate-500">Qualité moy.</span>
              <div className="text-lg font-bold text-slate-900">{kpis.avgQuality.toFixed(1)}/10</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Award className="w-4 h-4 text-blue-600" />
          <div>
            <span className="text-xs text-blue-600 font-medium">Prime estimée</span>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(bonusEstimate.amount)}</div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
