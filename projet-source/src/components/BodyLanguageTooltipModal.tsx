import React, { useState } from "react";
import {
  Eye,
  UserCheck,
  Smile,
  Sparkles,
  X,
  Info,
  CheckCircle2,
  Sun,
  Lightbulb,
  Video,
  Camera,
  ShieldCheck
} from "lucide-react";
import { LiveVideoMetrics } from "../types";

interface BodyLanguageTooltipModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics?: LiveVideoMetrics;
}

export const BodyLanguageTooltipModal: React.FC<BodyLanguageTooltipModalProps> = ({
  isOpen,
  onClose,
  metrics
}) => {
  const [activeTab, setActiveTab] = useState<"eye" | "posture" | "expression" | "lighting">("eye");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Guide de Communication Non-Verbale & Posture</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Coaching IA
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Conseils pratiques et ajustements en temps réel pour captiver votre recruteur.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Metrics Summary Bar (if metrics provided) */}
        {metrics && (
          <div className="bg-indigo-950/40 border-b border-indigo-500/20 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contact Visuel</span>
              <span className="text-base font-extrabold text-emerald-400">{metrics.eyeContactScore}%</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Posture</span>
              <span className="text-xs font-bold text-sky-300 truncate block mt-1">{metrics.postureQuality}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Expression</span>
              <span className="text-xs font-bold text-indigo-300 truncate block mt-1">{metrics.facialExpression}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assurance Perçue</span>
              <span className="text-base font-extrabold text-indigo-400">{metrics.perceivedConfidence}/100</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 overflow-x-auto">
          {[
            { id: "eye", label: "Contact Visuel", icon: Eye },
            { id: "posture", label: "Posture & Cadrage", icon: UserCheck },
            { id: "expression", label: "Visage & Gestuelle", icon: Smile },
            { id: "lighting", label: "Lumière & Caméra", icon: Sun },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
          {activeTab === "eye" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm mb-1">
                    L'Art du Regard à la Caméra
                  </h4>
                  <p className="text-slate-300">
                    En visioconférence, regarder les yeux du recruteur sur votre écran équivaut pour lui à un regard baissé. Pour donner l'impression d'un contact visuel direct, <strong>fixez directement l'objectif physique de votre webcam</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-indigo-400">
                  Techniques Clés d'Amélioration :
                </h5>

                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Alignement de la fenêtre vidéo :</strong> Placez la miniature vidéo de votre interlocuteur tout en haut de votre écran, juste en dessous de votre webcam, pour minimiser le décalage du regard.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">La Règle du 70/30 :</strong> Maintenez le regard sur l'objectif pendant 70% de votre temps de parole (pour transmettre de l'assurance), et accordez-vous 30% de pause visuelle pour réfléchir sans fuir l'écran.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Évitez le balayage de l'écran :</strong> Ne lisez jamais des notes posées à côté de votre écran pendant que vous répondez, car les micro-mouvements oculaires sont très visibles.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "posture" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-4 flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sky-300 text-sm mb-1">
                    Posture Dynamique & Ancrage
                  </h4>
                  <p className="text-slate-300">
                    Une posture droite mais détendue signale le calme, l'autorité naturelle et la préparation. S'avachir ou se rapprocher excessivement du micro peut projeter du stress ou du laisser-aller.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-sky-400">
                  Recommandations de Posture :
                </h5>

                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Position des épaules :</strong> Roulez vos épaules légèrement vers l'arrière et abaissez-les. Cela ouvre votre thorax, libère votre respiration et stabilise votre voix.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Centrage dans le cadre (Plan Poitrine) :</strong> Positionnez votre buste au centre de la vidéo. Laissez un espace équivalent à la largeur d'une main entre le sommet de votre tête et le haut de l'image.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Inclinaison légère vers l'avant :</strong> Se pencher très légèrement vers la caméra (5°) lors des points importants montre votre enthousiasme et votre engagement actif.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "expression" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-3">
                <Smile className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-300 text-sm mb-1">
                    Expressions Faciales & Micro-Mouvements
                  </h4>
                  <p className="text-slate-300">
                    La neutralité excessive du visage peut être interprétée comme de l'indifférence ou de la rigidité. Adoptez un visage expressif et avenant pour créer de la sympathie.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-indigo-400">
                  Conseils d'Expression :
                </h5>

                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Le Sourire d’Accroche :</strong> Entamez vos salutations et concluez vos réponses avec un véritable sourire. Cela active la bienveillance de votre interlocuteur.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Hochements de tête mesurés :</strong> Hochez la tête 1 à 2 fois lorsque le recruteur s'exprime pour confirmer que vous assimilez l'information.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Mains visibles & Gestes ouverts :</strong> Si le cadrage le permet, utilisez des gestes ouverts (paumes vers le haut) pour illustrer vos explications structurées.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "lighting" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300 text-sm mb-1">
                    Éclairage & Hauteur de Caméra
                  </h4>
                  <p className="text-slate-300">
                    Un bon environnement technique renforce instantanément votre professionnalisme perçu avant même que vous ne preniez la parole.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                  Ajustements Techniques :
                </h5>

                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Lumière face à vous :</strong> Placez toujours votre source lumineuse (fenêtre ou lampe de bureau) de face ou à 45°. Évitez absolument les fenêtres situées dans votre dos (effet de contre-jour sombre).
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Hauteur d'objectif :</strong> Rehaussez votre ordinateur portable à l'aide de livres pour que la caméra soit strictement à hauteur de vos yeux (évitez l'angle en contre-plongée qui grossit le menton).
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Arrière-plan sobre :</strong> Privilégiez un fond rangé, neutre et professionnel pour ne pas capturer l'attention visuelle de votre évaluateur.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Analyse locale et sécurisée traitée en temps réel</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            J'ai compris, revenir à l'entretien
          </button>
        </div>
      </div>
    </div>
  );
};
