'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, Sparkles, Check, Info, ShieldCheck } from 'lucide-react';
import { UserSettings } from '@/types/book';
import { getStoredSettings, saveStoredSettings } from '@/lib/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredSettings());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = saveStoredSettings(settings);
    setSavedSuccess(true);
    onSettingsSaved?.(updated);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-['Outfit']">
                Publishing Engine Settings
              </h2>
              <p className="text-xs text-slate-400">
                Configure Gemini API, models, and author credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-5">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                Google Gemini API Key
              </span>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.geminiApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, geminiApiKey: e.target.value })
                }
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Keys are stored strictly in your local browser storage or picked from environment.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Primary Writer Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Highest mathematical rigor & deep proofs' },
                { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Sub-second speed & fast blueprints' },
              ].map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, selectedModel: model.id })}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    settings.selectedModel === model.id
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200">{model.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{model.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-200">
                Pre-Computed / Simulation Mode
              </div>
              <div className="text-[11px] text-slate-400">
                Use pre-baked high-rigor physics/math chapters (zero token costs & instant offline demo)
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, useSimulation: !settings.useSimulation })
              }
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.useSimulation ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Default Author Information */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Default Author(s)</label>
              <input
                type="text"
                value={settings.defaultAuthor}
                onChange={(e) =>
                  setSettings({ ...settings, defaultAuthor: e.target.value })
                }
                placeholder="Prof. N. Bohr & A. Einstein"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-slate-200 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Affiliation</label>
              <input
                type="text"
                value={settings.defaultAffiliation}
                onChange={(e) =>
                  setSettings({ ...settings, defaultAffiliation: e.target.value })
                }
                placeholder="Institute for Advanced Study"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Saved!
              </>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
