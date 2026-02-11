import { useState } from 'react';
import { PenSquare, History, FileText } from 'lucide-react';
import EmailComposer from './EmailComposer';
import EmailTemplatesManager from './EmailTemplatesManager';
import EmailHistory from './EmailHistory';

type SubTab = 'compose' | 'history' | 'templates';

interface EmailSectionProps {
  userId: string;
  userRole: string;
}

export default function EmailSection({ userId, userRole }: EmailSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('compose');

  const subTabs: { key: SubTab; label: string; icon: typeof PenSquare }[] = [
    { key: 'compose', label: 'Composer', icon: PenSquare },
    { key: 'history', label: 'Historique', icon: History },
    { key: 'templates', label: 'Modeles', icon: FileText },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1 w-fit">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-all ${
                activeSubTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'compose' && (
        <EmailComposer
          userId={userId}
          userRole={userRole}
          onSent={() => setActiveSubTab('history')}
        />
      )}

      {activeSubTab === 'history' && (
        <EmailHistory userId={userId} />
      )}

      {activeSubTab === 'templates' && (
        <EmailTemplatesManager userId={userId} userRole={userRole} />
      )}
    </div>
  );
}
