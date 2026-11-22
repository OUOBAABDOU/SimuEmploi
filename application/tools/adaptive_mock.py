"""Adapt the S0 mockup with explicit local branching, without an AI/API call."""

import re


def adapt_reference(fragment: str) -> str:
    fragment = fragment.replace(
        '<option value="partial">Rapport partiel</option>',
        '<option value="partial">Rapport partiel</option>'
        '<option value="next_loading">Question suivante en préparation</option>'
        '<option value="next_failed">Question suivante indisponible</option>',
    )
    fragment = fragment.replace(
        "v.confirmRestart=false;});",
        "v.confirmRestart=false;v.axisIndex=0;v.relancesUsed=0;v.dynamicQuestion='';"
        "v.turns=[];v.nextState='not_requested';});",
        1,
    )
    fragment = fragment.replace(
        "question=exercise.questions[q-1]",
        "question=v.dynamicQuestion||exercise.questions[0]",
    )
    fragment = fragment.replace(
        "tips[v.scenario]?.[v.question-1]", "tips[v.scenario]?.[v.axisIndex||0]"
    )
    fragment = fragment.replace("Question ${q} sur 5", "Question ${q} · jusqu’à 7 questions")
    fragment = fragment.replace("'Question '+q+' sur 5'", "'Question '+q+' · jusqu’à 7 questions'")
    fragment = fragment.replace(
        "q===5?'Terminer la session':'Passer à la question suivante'",
        "'Voir la suite de l’entretien'",
    )
    fragment = fragment.replace("${q-1} réponse", "${(v.turns||[]).length} réponse")
    fragment = fragment.replace('aria-valuenow="${q-1}"', 'aria-valuenow="${v.axisIndex||0}"')
    fragment = fragment.replace(
        'aria-label="Réponses validées dans la session"',
        'aria-label="Axes terminés dans la session"',
    )
    fragment = fragment.replace("${(q-1)*20}%", "${(v.axisIndex||0)*20}%")
    fragment = fragment.replace("5 questions", "5 axes · jusqu’à 7 questions")
    fragment = fragment.replace("Environ 12 min", "Durée indicative · relances possibles")
    fragment = fragment.replace("5 réponses", "Réponses de démonstration")
    fragment = fragment.replace(
        "v.question=1;v.answer='';v.paused=false;",
        "v.question=1;v.axisIndex=0;v.relancesUsed=0;v.dynamicQuestion='';v.turns=[];"
        "v.nextState='not_requested';v.answer='';v.paused=false;",
    )
    context_helper = """function previousContext(v) {
      const turn=(v.turns||[]).at(-1);
      if(!turn||!v.dynamicQuestion)return '';
      return `<details class="se-context"><summary>Retrouver le contexte précédent</summary>
        <p class="se-sub"><strong>Question précédente :</strong> ${esc(turn.question)}</p>
        <p class="se-sub"><strong>Réponse confirmée de démonstration :</strong>
          ${esc(turn.answer)}</p>
        </details>`;
    }
    function content(v)"""
    fragment = fragment.replace("function content(v)", context_helper, 1)
    fragment = fragment.replace(
        '<p class="se-question" id="${v.element.id}-question">',
        '${previousContext(v)}<p class="se-question" id="${v.element.id}-question">',
        1,
    )
    replacement = """else if(action==='next') {
        if(v.situation==='next_loading'||v.situation==='next_failed'||v.situation==='offline') {
          v.nextState=v.situation==='next_loading'?'queued':'unavailable';
          v.message=v.nextState==='queued'
            ? 'Question suivante en préparation. Réponse confirmée conservée dans cette maquette.'
            : 'Question suivante indisponible. Réponse conservée ; vous pourrez réessayer.';
        } else {
          const previousQuestion=v.dynamicQuestion||scenario(v).questions[0];
          const previousAnswer=v.answer;
          const canClarify=previousAnswer.trim().length<80&&v.relancesUsed<2;
          const nextAxis=canClarify?(v.axisIndex||0):(v.axisIndex||0)+1;
          if(nextAxis>=5||v.question>=7) {
            v.turns.push({question:previousQuestion,answer:previousAnswer,next_question:null,
              source:'local_design_fixture_no_ai'});
            v.screen='finish';v.finished=true;
          }
          else {
            const excerpt=previousAnswer.trim().slice(0,70);
            const basis=scenario(v).questions[nextAxis];
            const previousTopic=previousQuestion.toLocaleLowerCase('fr');
            const clarification=previousTopic.includes('stage')
              ? 'Pour préciser ce stage, qu’aimeriez-vous apprendre en premier ?'
              : /poste|emploi/.test(previousTopic)
                ? 'Pour préciser ce poste, quelle contribution pouvez-vous expliquer ?'
                : 'Pour préciser cette idée, quel exemple simple pouvez-vous donner ?';
            const nextPrompt=canClarify
              ? 'Vous évoquez « '+excerpt+' ». '+clarification
              : 'À partir de votre réponse « '+excerpt+' », poursuivons : '+basis;
            v.turns.push({question:previousQuestion,answer:previousAnswer,next_question:nextPrompt,
              previous_question:previousQuestion,previous_answer:previousAnswer,kind:canClarify?'clarification':'next_axis',
              source:'local_design_fixture_no_ai'});
            if(canClarify)v.relancesUsed++;
            v.axisIndex=nextAxis;v.dynamicQuestion=nextPrompt;v.question++;
            v.screen='practice';v.answer='';v.readOnly=false;v.nextState='ready';
            v.message='Question adaptée de démonstration liée au tour précédent. '
              +'Aucun fournisseur IA appelé.';
          }
        }
      }
      else if(action==='retry')"""
    fragment, count = re.subn(
        r"else if\(action==='next'\) \{.*?\n      else if\(action==='retry'\)",
        replacement,
        fragment,
        count=1,
        flags=re.DOTALL,
    )
    if count != 1:
        raise ValueError("Adaptive next-question branch was not inserted")
    return fragment
