import { useEffect, useRef, useState } from 'react';
import { ApiError, readApi, type CatalogPage, type Domain, type ScenarioDetail } from './api';

type Route = { screen: 'welcome' | 'catalog' | 'prepare' | 'help'; domain: Domain | 'all'; id?: string };
type Remote<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error'; message: string };

function parseRoute(): Route {
  const url = new URL(window.location.hash.slice(1) || '/', window.location.origin);
  const chosen = url.searchParams.get('domain');
  const domain = chosen === 'beginner' || chosen === 'presentation' ? chosen : 'all';
  const match = /^\/exercices\/([a-f0-9-]{36})$/.exec(url.pathname);
  if (match) return { screen: 'prepare', id: match[1], domain };
  if (url.pathname === '/exercices') return { screen: 'catalog', domain };
  if (url.pathname === '/aide') return { screen: 'help', domain };
  return { screen: 'welcome', domain };
}

function catalogLink(domain: Route['domain']): string {
  return `#/exercices${domain === 'all' ? '' : `?domain=${domain}`}`;
}

function useRemote<T>(path: string | null, attempt: number): Remote<T> {
  const [result, setResult] = useState<{ path: string | null; attempt: number; state: Remote<T> }>({
    path: null, attempt: -1, state: { status: 'loading' },
  });
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    const setState = (state: Remote<T>) => setResult({ path, attempt, state });
    setState({ status: 'loading' });
    readApi<T>(path, controller.signal).then(
      data => { if (!controller.signal.aborted) setState({ status: 'ready', data }); },
      (error: unknown) => {
        if (!controller.signal.aborted) setState({ status: 'error', message: error instanceof ApiError
          ? error.message : 'La connexion au service est indisponible. Vérifiez votre connexion puis réessayez.' });
      },
    );
    return () => controller.abort();
  }, [path, attempt]);
  return result.path === path && result.attempt === attempt ? result.state : { status: 'loading' };
}

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function InterviewArt() {
  return <svg className="interview-art" viewBox="0 0 480 350" aria-hidden="true" focusable="false">
    <rect x="25" y="22" width="430" height="300" rx="32" fill="#e9eee6" />
    <circle cx="350" cy="88" r="42" fill="#f5c898" />
    <rect x="295" y="111" width="111" height="117" rx="10" fill="#fffdf6" transform="rotate(8 295 111)" />
    <path d="m315 139 67 9m-70 14 55 8m-58 15 67 9" stroke="#c6cbbb" strokeWidth="7" strokeLinecap="round" />
    <path d="M92 224c1-51 32-83 74-83s66 28 76 82" fill="#1a6758" />
    <path d="M119 105c0-36 22-59 55-59 34 0 55 27 47 58l-14 50h-78z" fill="#322f2b" />
    <ellipse cx="170" cy="106" rx="37" ry="44" fill="#a8653f" />
    <path d="M128 87c13 2 34-8 44-24 12 18 25 26 43 29-1-43-83-49-87-5" fill="#322f2b" />
    <path d="M152 144v18c9 10 25 10 35 0v-18" fill="#a8653f" />
    <path d="m122 195 43 37 63-25" stroke="#a8653f" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect x="215" y="185" width="130" height="77" rx="8" fill="#80a89b" />
    <rect x="225" y="196" width="110" height="52" rx="4" fill="#e6f0e9" />
    <path d="m243 219 9 9 18-20m9 11h34" fill="none" stroke="#1a6758" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M62 266h344" stroke="#cb9a66" strokeWidth="14" strokeLinecap="round" />
    <path d="M87 275v46m294-46v46" stroke="#b68351" strokeWidth="12" />
    <rect x="98" y="280" width="104" height="25" rx="10" fill="#397b68" />
    <circle cx="418" cy="242" r="14" fill="#d4925b" /><path d="M418 228v-47m0 27-16-16m16 6 14-16" stroke="#397b68" strokeWidth="6" strokeLinecap="round" />
  </svg>;
}

function RemoteNotice({ state, retry }: { state: Remote<unknown>; retry: () => void }) {
  return state.status === 'error'
    ? <div className="notice error" role="alert"><h2>Retrouvons votre exercice</h2><p>{state.message}</p><button className="button secondary" onClick={retry}>Réessayer</button><a href="#/exercices">Revenir aux exercices</a></div>
    : <p className="loading" role="status">Chargement des exercices…</p>;
}

export function App() {
  const [route, setRoute] = useState<Route>(parseRoute);
  const [attempt, setAttempt] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const change = () => setRoute(parseRoute());
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    document.title = `${route.screen === 'catalog' ? 'Choisir un exercice' : route.screen === 'prepare'
      ? 'Préparer mon entretien' : route.screen === 'help' ? 'Aide' : 'Mon premier entretien'} — SimuEmploi`;
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [route.screen, route.id]);

  const path = route.screen === 'catalog' ? `/api/v1/scenarios${route.domain === 'all' ? '' : `?domain=${route.domain}`}`
    : route.screen === 'prepare' ? `/api/v1/scenarios/${route.id}` : null;
  const remote = useRemote<CatalogPage | ScenarioDetail>(path, attempt);
  const list = remote.status === 'ready' && 'items' in remote.data ? remote.data : null;
  const detail = remote.status === 'ready' && 'questions' in remote.data ? remote.data : null;
  const title = route.screen === 'welcome' ? 'Votre premier entretien se prépare, un pas à la fois.'
    : route.screen === 'catalog' ? 'Choisissez ce que vous voulez travailler.'
    : route.screen === 'help' ? 'Un repère pour bien commencer.' : detail?.title ?? 'Préparer mon entretien';

  return <>
    <a className="skip-link" href="#content" onClick={event => {
      event.preventDefault();
      document.getElementById('content')?.focus();
    }}>Aller au contenu</a>
    <header className="site-header"><a className="brand" href="#/" aria-label="SimuEmploi, accueil"><span className="brand-mark" aria-hidden="true">S</span><span>SimuEmploi</span></a><nav aria-label="Navigation principale">
      <a href="#/" aria-current={route.screen === 'welcome' ? 'page' : undefined}>Découvrir</a>
      <a href="#/exercices" aria-current={route.screen === 'catalog' || route.screen === 'prepare' ? 'page' : undefined}>Exercices</a>
      <a href="#/aide" aria-current={route.screen === 'help' ? 'page' : undefined}>Aide</a>
    </nav><span className="country">Burkina Faso · Français</span></header>
    <main id="content" tabIndex={-1}>
      <div className="work-notice"><span aria-hidden="true" className="notice-dot" />Version de travail : les exercices sont des exemples à relire avant l’ouverture du service.</div>
      {route.screen === 'prepare' && <a className="back-link" href={catalogLink(route.domain)}>← Retour aux exercices</a>}
      <section className={route.screen === 'welcome' ? 'hero' : 'page-intro'}>
        <div><p className="eyebrow">{route.screen === 'welcome' ? 'Premier emploi ou stage' : route.screen === 'catalog' ? 'Un exercice, un objectif' : route.screen === 'help' ? 'À votre rythme' : 'Avant de commencer'}</p>
          <h1 tabIndex={-1} ref={heading}>{title}</h1>
          <p className="lead">{route.screen === 'welcome' ? 'Vous n’avez pas besoin d’un long parcours professionnel. Un projet scolaire, une activité ou une expérience personnelle peut vous aider à montrer ce que vous savez faire.'
            : route.screen === 'catalog' ? 'Lisez l’objectif, puis découvrez les questions et les repères pour préparer vos exemples.'
            : route.screen === 'help' ? 'Des questions simples pour parler de votre parcours avec vos propres mots.' : detail?.summary ?? 'Retrouvez l’objectif et les repères de cet exercice.'}</p>
          {route.screen === 'welcome' && <><a className="button primary" href="#/exercices">Choisir mon premier exercice <Arrow /></a><p className="small-note">Questions en français · Préparation en texte</p></>}
        </div>{route.screen === 'welcome' && <InterviewArt />}
      </section>
      {route.screen === 'welcome' && <>
        <section className="steps" aria-label="Comment commencer">{[
          ['01', 'Choisir une situation', 'Un stage, un premier emploi ou une présentation de votre parcours.'],
          ['02', 'Préparer vos exemples', 'Des questions et une aide adaptée pour organiser vos idées.'],
          ['03', 'Pratiquer à votre rythme', 'Les séances et les retours seront disponibles à une prochaine étape.'],
        ].map(([n,t,d]) => <article key={n}><span className="step-number">{n}</span><h2>{t}</h2><p>{d}</p></article>)}</section>
        <section className="start-panel"><div><p className="eyebrow">Une expérience suffit pour commencer</p><h2>Votre prochain objectif : un stage ?</h2><p>Préparez une façon simple de présenter votre motivation et un projet auquel vous avez participé.</p></div><a className="button secondary" href="#/exercices/11111111-1111-4111-8111-111111111111">Lire la préparation <Arrow /></a></section>
      </>}
      {route.screen === 'catalog' && <section aria-label="Catalogue des exercices">
        <div className="catalog-tools"><label htmlFor="domain">Mon point de travail<select id="domain" value={route.domain} onChange={event => { window.location.hash = catalogLink(event.target.value as Route['domain']).slice(1); }}>
          <option value="all">Tous les exercices</option><option value="beginner">Premier emploi ou stage</option><option value="presentation">Présentation de mon parcours</option>
        </select></label><p role="status">{list ? `${list.items.length} exercice${list.items.length > 1 ? 's' : ''}` : 'Chargement…'}</p></div>
        {list ? list.items.length ? <div className="exercise-grid">{list.items.map((item,i) => <article className="exercise-card" key={item.id}>
          <div className={`card-art art-${item.objective}`} aria-hidden="true"><span>{item.objective === 'internship' ? 'Mon premier stage' : item.domain === 'presentation' ? 'Mon parcours' : 'Mon premier emploi'}</span><span className="art-pages"><i /><i /><i /></span></div>
          <div className="card-body"><span className="tag">{i === 0 && route.domain !== 'presentation' ? 'Pour commencer' : 'À explorer'}</span><h2>{item.title}</h2><p>{item.summary}</p><div className="card-meta"><span>{item.question_count} questions</span><span>Environ {item.estimated_minutes} min</span><span>Texte</span></div><a className="button secondary" href={`#/exercices/${item.id}${route.domain === 'all' ? '' : `?domain=${route.domain}`}`}>Lire la préparation <Arrow /></a></div>
        </article>)}</div> : <div className="notice"><h2>Aucun exercice pour ce filtre</h2><p>Essayez un autre point de travail.</p><a href="#/exercices">Voir tous les exercices</a></div>
          : <RemoteNotice state={remote} retry={() => setAttempt(n => n+1)} />}
      </section>}
      {route.screen === 'prepare' && (detail ? <>
        <div className="prepare-grid"><section className="panel"><span className="tag">Mon exercice</span><h2>Un entretien en {detail.question_count} questions</h2><p>Environ {detail.estimated_minutes} minutes, sans compte à rebours.</p><ol className="preparation-list">{detail.preparation.map(t => <li key={t}>{t}</li>)}</ol></section>
          <section className="panel warm"><span className="tag">Avec vos propres mots</span><h2>Un repère pour vous préparer</h2><p>Choisissez un exemple réel. Expliquez ce que vous avez fait et ce que vous avez appris.</p><p>Évitez les noms et les informations personnelles d’autres personnes.</p><div className="availability"><strong>Les séances ne sont pas encore ouvertes.</strong><p>Pour cette première étape, vous pouvez lire les questions et préparer vos idées. Aucune réponse n’est recueillie ici.</p></div></section></div>
        <section className="question-plan"><h2>Les questions à préparer</h2><p>Ouvrez un repère si vous avez besoin d’aide pour organiser votre réponse.</p>{detail.questions.map((question,i) => <details key={question.key}><summary><span className="question-number">{i+1}</span><span>{question.prompt}</span><span className="expand-icon" aria-hidden="true">+</span></summary><ul>{question.guidance.map(text => <li key={text}>{text}</li>)}</ul></details>)}</section>
        <section className="rubric"><h2>Ce que cet exercice vous aide à travailler</h2><div className="rubric-grid">{detail.rubric.map(c => <article key={c.key}><h3>{c.label}</h3><p>{c.description}</p></article>)}</div><p className="small-note">Questions et critères proposés · Version {detail.version} · Relecture métier à réaliser.</p></section>
      </> : <RemoteNotice state={remote} retry={() => setAttempt(n => n+1)} />)}
      {route.screen === 'help' && <div className="help-grid"><section className="panel"><h2>Je n’ai jamais travaillé. Que puis-je raconter ?</h2><p>Un projet scolaire, une activité associative, une aide apportée à un proche ou une activité informelle peuvent donner un exemple pertinent. Dites ce que vous avez réellement fait.</p><h2>Faut-il activer la caméra ?</h2><p>Vous pouvez préparer ces exercices en texte. Aucune caméra ni aucun microphone ne sont demandés ici.</p></section><section className="panel"><h2>Puis-je commencer une séance maintenant ?</h2><p>Cette version permet de découvrir les exercices et leur préparation. Les comptes, les réponses sauvegardées et les retours seront ajoutés lors des prochaines étapes.</p><h2>Est-ce une garantie d’embauche ?</h2><p>Le service vise à vous aider à préparer un entretien. Il ne décide pas d’un recrutement et ne garantit pas une embauche.</p><a className="button secondary" href="#/exercices">Choisir un exercice <Arrow /></a></section></div>}
    </main>
    <footer className="site-footer"><span className="footer-brand">SimuEmploi</span><p>Un entraînement pour préparer votre entretien.</p><a href="#/aide">Aide et fonctionnement</a></footer>
  </>;
}
