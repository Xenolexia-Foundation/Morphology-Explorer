import { WordInput, EmptyState, AnalysisResult } from "./components";
import { useAnalyze } from "./hooks/useAnalyze";

export default function App() {
  const { word, setWord, lang, setLang, result, runAnalysis } = useAnalyze();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis();
  };

  const showEmpty = result === null && word.trim() !== "";

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Morphology Explorer</h1>
        <p className="app__tagline">
          Enter a word to see root, pattern, and related words (local rules).
        </p>
      </header>

      <WordInput
        word={word}
        lang={lang}
        onWordChange={setWord}
        onLangChange={setLang}
        onSubmit={handleSubmit}
      />

      {showEmpty && <EmptyState />}
      {result != null && <AnalysisResult result={result} lang={lang} />}
    </main>
  );
}
