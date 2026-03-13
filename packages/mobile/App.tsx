import { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import type { Language } from "@morphology-explorer/core";
import { analyze, getRelatedWords } from "@morphology-explorer/analyzer";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "ar", label: "Arabic" },
  { value: "ja", label: "Japanese" },
];

export default function App() {
  const [word, setWord] = useState("");
  const [lang, setLang] = useState<Language>("ar");
  const [result, setResult] = useState<ReturnType<typeof analyze>>(null);

  const runAnalysis = useCallback(() => {
    const trimmed = word.trim();
    if (!trimmed) {
      setResult(null);
      return;
    }
    setResult(analyze(trimmed, lang));
  }, [word, lang]);

  const related = result?.root ? getRelatedWords(result.root.id, lang) : [];
  const showEmpty = result === null && word.trim() !== "";

  return (
    <>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Morphology Explorer</Text>
            <Text style={styles.tagline}>
              Enter a word to see root, pattern, and related words (local rules).
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, lang === "ar" && styles.inputRtl]}
              value={word}
              onChangeText={setWord}
              placeholder="Enter a word…"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={runAnalysis}
              returnKeyType="go"
            />
            <View style={styles.langRow}>
              {LANGUAGES.map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  style={[styles.langBtn, lang === value && styles.langBtnActive]}
                  onPress={() => setLang(value)}
                >
                  <Text style={[styles.langBtnText, lang === value && styles.langBtnTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={runAnalysis} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Analyze</Text>
            </TouchableOpacity>
          </View>

          {showEmpty && (
            <View style={styles.result}>
              <Text style={styles.emptyText}>No analysis found for this word.</Text>
            </View>
          )}

          {result != null && (
            <View style={styles.result}>
              <Text style={styles.resultTitle}>Result</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Root</Text>
                <Text style={[styles.value, styles.arabic]} dir="rtl">
                  {result.root.consonants.join("–")}
                  {result.root.meaning != null ? ` (${result.root.meaning})` : ""}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pattern</Text>
                <Text style={[styles.value, styles.arabic]} dir="rtl">
                  {result.pattern.template}
                  {result.pattern.meaning != null ? ` (${result.pattern.meaning})` : ""}
                </Text>
              </View>
              {related.length > 0 && (
                <>
                  <Text style={styles.relatedTitle}>Related words</Text>
                  {related.map((r, i) => (
                    <Text key={`${r.patternId}-${i}`} style={[styles.relatedItem, styles.arabic]} dir="rtl">
                      {r.word} — {r.patternMeaning ?? r.patternId}
                    </Text>
                  ))}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 56,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 15,
    color: "#444",
  },
  form: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: "#1a1a1a",
    marginBottom: 12,
  },
  inputRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  langBtnActive: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  langBtnText: {
    fontSize: 15,
    color: "#1a1a1a",
  },
  langBtnTextActive: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  result: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    padding: 20,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#444",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: "#1a1a1a",
  },
  arabic: {
    fontSize: 20,
    writingDirection: "rtl",
    textAlign: "right",
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#d0d0d0",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  relatedItem: {
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 6,
    writingDirection: "rtl",
    textAlign: "right",
  },
});
