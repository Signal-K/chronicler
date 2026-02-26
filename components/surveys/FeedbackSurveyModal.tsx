import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type SurveyQuestion =
  | {
      id: string;
      prompt: string;
      type: 'scale';
      min?: number;
      max?: number;
    }
  | {
      id: string;
      prompt: string;
      type: 'choice';
      options: string[];
    };

export interface SurveyDefinition {
  id: string;
  title: string;
  subtitle: string;
  questions: [SurveyQuestion, SurveyQuestion] | [SurveyQuestion, SurveyQuestion, SurveyQuestion];
  commentPrompt?: string;
}

interface FeedbackSurveyModalProps {
  visible: boolean;
  survey: SurveyDefinition | null;
  initialComment?: string;
  onClose: () => void;
  onSubmit: (answers: Record<string, string | number>, comment: string) => void;
}

function sanitizeTestIdValue(value: string | number): string {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, '_');
}

export function FeedbackSurveyModal({ visible, survey, initialComment = '', onClose, onSubmit }: FeedbackSurveyModalProps) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!visible || !survey) return;
    setAnswers({});
    setComment(initialComment);
  }, [initialComment, survey, visible]);

  const canSubmit = useMemo(() => {
    if (!survey) return false;
    return survey.questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');
  }, [answers, survey]);

  const handleSubmit = () => {
    if (!survey || !canSubmit) return;
    onSubmit(answers, comment.trim());
    setAnswers({});
    setComment('');
  };

  const handleClose = () => {
    setAnswers({});
    setComment('');
    onClose();
  };

  if (!survey) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose} testID="survey-modal">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.card} onPress={() => {}} testID="survey-modal-card">
          <Text style={styles.title}>{survey.title}</Text>
          <Text style={styles.subtitle}>{survey.subtitle}</Text>

          {survey.questions.map((q) => (
            <View key={q.id} style={styles.question} testID={`survey-question-${q.id}`}>
              <Text style={styles.prompt}>{q.prompt}</Text>
              {q.type === 'scale' ? (
                <View style={styles.scaleRow}>
                  {Array.from({ length: (q.max ?? 5) - (q.min ?? 1) + 1 }, (_, idx) => (q.min ?? 1) + idx).map((value) => {
                    const selected = answers[q.id] === value;
                    return (
                      <TouchableOpacity
                        key={`${q.id}-${value}`}
                        style={[styles.pill, selected && styles.pillSelected]}
                        testID={`survey-answer-${q.id}-${sanitizeTestIdValue(value)}`}
                        onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
                      >
                        <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.choiceCol}>
                  {q.options.map((option) => {
                    const selected = answers[q.id] === option;
                    return (
                      <TouchableOpacity
                        key={`${q.id}-${option}`}
                        style={[styles.choiceButton, selected && styles.choiceButtonSelected]}
                        testID={`survey-answer-${q.id}-${sanitizeTestIdValue(option)}`}
                        onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                      >
                        <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}

          <Text style={styles.prompt}>{survey.commentPrompt || 'Optional comment'}</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            style={styles.comment}
            placeholder="Tell us more..."
            multiline
            testID="survey-comment-input"
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleClose} testID="survey-close-button">
              <Text style={styles.secondaryText}>Later</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]} disabled={!canSubmit} onPress={handleSubmit} testID="survey-submit-button">
              <Text style={styles.primaryText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 16,
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#4b5563' },
  question: { marginTop: 8, gap: 6 },
  prompt: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  scaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    minWidth: 34,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  pillSelected: { backgroundColor: '#065f46', borderColor: '#065f46' },
  pillText: { color: '#111827', fontWeight: '600' },
  pillTextSelected: { color: '#ecfdf5' },
  choiceCol: { gap: 6 },
  choiceButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  choiceButtonSelected: { backgroundColor: '#065f46', borderColor: '#065f46' },
  choiceText: { color: '#111827' },
  choiceTextSelected: { color: '#ecfdf5' },
  comment: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    minHeight: 72,
    padding: 10,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  secondaryBtn: { paddingHorizontal: 12, paddingVertical: 10 },
  secondaryText: { color: '#374151', fontWeight: '600' },
  primaryBtn: { backgroundColor: '#065f46', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  primaryBtnDisabled: { backgroundColor: '#9ca3af' },
  primaryText: { color: '#ecfdf5', fontWeight: '700' },
});
