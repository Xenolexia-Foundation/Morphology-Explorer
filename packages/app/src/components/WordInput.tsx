import type { Language } from "@morphology-explorer/core";

interface WordInputProps {
  word: string;
  lang: Language;
  onWordChange: (value: string) => void;
  onLangChange: (value: Language) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export function WordInput({
  word,
  lang,
  onWordChange,
  onLangChange,
  onSubmit,
  placeholder = "Enter a word…",
}: WordInputProps) {
  return (
    <form onSubmit={onSubmit} className="word-input">
      <div className="word-input__row">
        <input
          type="text"
          value={word}
          onChange={(e) => onWordChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Word"
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="word-input__field"
          autoFocus
        />
        <select
          value={lang}
          onChange={(e) => onLangChange(e.target.value as Language)}
          aria-label="Language"
          className="word-input__lang"
        >
          <option value="ar">Arabic</option>
          <option value="ja">Japanese</option>
        </select>
        <button type="submit" className="word-input__submit">
          Analyze
        </button>
      </div>
    </form>
  );
}
