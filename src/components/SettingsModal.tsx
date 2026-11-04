import React from 'react';
import { FaceConfig } from '../types/robot';
import { COLOR_THEMES, DEFAULT_CONFIG } from '../utils/expressionPresets';
import { X, RotateCcw, Download, Upload, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FaceConfig;
  onChangeConfig: (newConfig: FaceConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig
}) => {
  if (!isOpen) return null;

  const update = (partial: Partial<FaceConfig>) => {
    onChangeConfig({ ...config, ...partial });
  };

  const resetDefaults = () => {
    onChangeConfig({ ...DEFAULT_CONFIG });
  };

  const exportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'robot_face_config.json');
    dlAnchorElem.click();
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onChangeConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch (err) {
        alert('Invalid configuration file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#30343B] border border-[#B0B4B8]/30 rounded-2xl p-6 shadow-xl flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#B0B4B8]/30">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#DCE8E1]" />
            <h2 className="text-base font-bold tracking-wide text-white">Face UI Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B0B4B8] hover:text-white hover:bg-[#202124] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-6 py-4 pr-1 text-sm font-mono">
          {/* Theme Presets */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B0B4B8] mb-2.5 font-bold">
              Color Theme Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map((theme) => {
                const isSelected = config.primaryColor === theme.primary;
                return (
                  <button
                    key={theme.name}
                    onClick={() => update({ primaryColor: theme.primary })}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-[#174D3A] bg-[#174D3A] text-white font-bold shadow-sm'
                        : 'border-[#B0B4B8]/30 bg-[#202124] text-[#B0B4B8] hover:text-white hover:border-[#174D3A]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span className="truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Eye Proportions */}
          <div className="space-y-4 pt-2 border-t border-[#B0B4B8]/20">
            <h3 className="text-xs uppercase tracking-wider text-[#DCE8E1] font-bold">Eye Proportions</h3>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Eye Size (Radius)</span>
                <span>{config.eyeSize}px</span>
              </div>
              <input
                type="range"
                min="38"
                max="75"
                value={config.eyeSize}
                onChange={(e) => update({ eyeSize: Number(e.target.value) })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Interocular Distance (Spacing)</span>
                <span>{config.eyeSpacing}px</span>
              </div>
              <input
                type="range"
                min="140"
                max="300"
                value={config.eyeSpacing}
                onChange={(e) => update({ eyeSpacing: Number(e.target.value) })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Vertical Offset</span>
                <span>{config.eyeOffsetY}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="40"
                value={config.eyeOffsetY}
                onChange={(e) => update({ eyeOffsetY: Number(e.target.value) })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>
          </div>

          {/* Mouth Proportions */}
          <div className="space-y-4 pt-2 border-t border-[#B0B4B8]/20">
            <h3 className="text-xs uppercase tracking-wider text-[#DCE8E1] font-bold">Mouth Proportions</h3>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Mouth Width</span>
                <span>{config.mouthWidth}px</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={config.mouthWidth}
                onChange={(e) => update({ mouthWidth: Number(e.target.value) })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Smile Curvature Depth</span>
                <span>{config.mouthCurve}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={config.mouthCurve}
                onChange={(e) => update({ mouthCurve: Number(e.target.value) })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Mouth Vertical Offset</span>
                <span>{config.mouthOffsetY}px</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={config.mouthOffsetY}
                onChange={(e) => update({ mouthOffsetY: Number(e.target.value) })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>
          </div>

          {/* Glow & Animation Dynamics */}
          <div className="space-y-4 pt-2 border-t border-[#B0B4B8]/20">
            <h3 className="text-xs uppercase tracking-wider text-[#DCE8E1] font-bold">Glow & Behavior</h3>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Glow Intensity</span>
                <span>{config.glowIntensity.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.0"
                step="0.05"
                value={config.glowIntensity}
                onChange={(e) => update({ glowIntensity: Number(e.target.value) })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#B0B4B8] mb-1">
                <span>Blink Interval (Avg)</span>
                <span>{config.blinkIntervalMin}s - {config.blinkIntervalMax}s</span>
              </div>
              <input
                type="range"
                min="2"
                max="9"
                step="0.5"
                value={config.blinkIntervalMin}
                onChange={(e) => update({
                  blinkIntervalMin: Number(e.target.value),
                  blinkIntervalMax: Number(e.target.value) + 2.5
                })}
                className="w-full accent-[#174D3A] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[#B0B4B8]/30 mt-2 font-mono text-xs">
          <button
            onClick={resetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#B0B4B8]/30 bg-[#202124] text-[#B0B4B8] hover:text-white hover:bg-[#17191C] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#DCE8E1]" />
            <span>Reset to Reference</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={exportConfig}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#B0B4B8]/30 bg-[#202124] text-[#B0B4B8] hover:text-white hover:bg-[#17191C] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#B0B4B8]/30 bg-[#202124] text-[#B0B4B8] hover:text-white hover:bg-[#17191C] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
            </label>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white font-bold transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
