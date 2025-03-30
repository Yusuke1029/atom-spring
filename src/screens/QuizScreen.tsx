import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Settings: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const QuizScreen: React.FC<Props> = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = async () => {
    try {
      // TODO: Implement quiz generation using API
      const dummyQuestions = [
        {
          question: "【原子力発電の基本】\n原子力発電所で使用される核分裂反応の主な燃料は何ですか？",
          options: [
            "ウラン235",
            "プルトニウム239",
            "トリウム232",
            "ラジウム226",
            "セシウム137"
          ],
          correct: 0,
          explanation: "「ウラン235」が正解です。現在の原子力発電所では主にウラン235を燃料として使用しています。"
        },
        // TODO: Add more questions
      ];
      setQuestions(dummyQuestions);
    } catch (error) {
      Alert.alert('エラー', 'クイズの生成に失敗しました');
    }
  };

  React.useEffect(() => {
    startQuiz();
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestionIndex];

  if (!questions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>クイズを準備中...</Text>
      </SafeAreaView>
    );
  }

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>テスト結果</Text>
          <Text style={styles.scoreText}>
            正解数: {score}/{questions.length}
          </Text>
          <Text style={styles.feedbackText}>
            {score === questions.length
              ? '【すばらしい結果】\n\n全問正解です！原子力への理解が深まっていますね。'
              : score >= questions.length / 2
              ? '【よくできました】\n\n基本的な理解ができています。'
              : '【もう少し頑張りましょう】\n\n一緒に理解を深めていきましょう。'}
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.homeButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const question = getCurrentQuestion();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            問題 {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index &&
                  (index === question.correct
                    ? styles.correctOption
                    : styles.incorrectOption),
                selectedAnswer !== null &&
                  index === question.correct &&
                  styles.correctOption,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}>
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === index &&
                    (index === question.correct
                      ? styles.correctOptionText
                      : styles.incorrectOptionText),
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}

        {selectedAnswer !== null && (
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1
                ? '結果を見る'
                : '次の問題へ'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    color: '#3498db',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  correctOption: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  incorrectOption: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
  },
  correctOptionText: {
    color: '#065F46',
  },
  incorrectOptionText: {
    color: '#991B1B',
  },
  explanationContainer: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  explanationText: {
    fontSize: 16,
    color: '#065F46',
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizScreen;