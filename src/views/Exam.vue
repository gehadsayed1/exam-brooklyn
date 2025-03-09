<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useStudentStore } from '../stores/studentStore';
import { useRouter } from 'vue-router';

const studentStore = useStudentStore();
const router = useRouter();

const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  ripple: true,
  position: { x: 'center', y: 'top' },
});

// نعتمد فقط على بيانات الامتحان الموجودة في localStorage
const examData = localStorage.getItem("exam");
console.log("Exam data (raw) from localStorage:", examData);

if (!examData) {
  notyf.error("لا توجد بيانات امتحان محفوظة.");
  // إعادة توجيه المستخدم لصفحة بدء الامتحان
  router.push({ name: 'ExamStartPage' });
}

// بعد التحقق من عدم كونه null، نقوم بفك الترميز
const AllExam = JSON.parse(examData);
console.log("AllExam after parse:", AllExam);

// نفترض أن البنية: { message: "...", data: { exam: {...} } }
const exam = AllExam.data.exam;
console.log("Exam object extracted from AllExam:", exam);

// تعيين القيم الافتراضية بناءً على بيانات الامتحان المستخرجة من localStorage
const duration = ref(exam.duration || 0);
const examId = ref(exam.id || null);
const questions = ref(exam.questions || []);
const result = ref(studentStore.result);

console.log("Initial duration:", duration.value);
console.log("Initial examId:", examId.value);
console.log("Initial questions:", questions.value);

const submitAnswers = studentStore.submitExamAnswers;
const examAnswers = ref([]);

const timeLeft = ref(duration.value);
const currentQuestionIndex = ref(0);
const selectedOption = ref(null);
const quizCompleted = ref(false);
const quizStarted = ref(false);
let interval;

// دالة لترتيب الأسئلة عشوائيًا إذا كنت ترغب بتغيير ترتيبها عند بدء الامتحان
const randomizeArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// الحصول على السؤال الحالي
const currentQuestion = computed(() => {
  if (questions.value && Array.isArray(questions.value) && questions.value.length > 0) {
    return questions.value[currentQuestionIndex.value];
  }
  return null;
});

// خاصية لمعرفة إذا كان السؤال الحالي هو الأخير
const isLastQuestion = computed(() => {
  return questions.value.length > 0 && currentQuestionIndex.value === questions.value.length - 1;
});

// دالة بدء المؤقت (تحديث كل ثانية)
const startTimer = () => {
  console.log("startTimer called. timeLeft:", timeLeft.value);
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(interval);
      notyf.error('Time is up! The quiz has ended.');
      quizCompleted.value = true;
      quizStarted.value = false;
      console.log("Time is up, submitting answers...");
      submitAnswers({ answers: examAnswers.value, examId: examId.value });
      clearExamState();
    }
  }, 1000);
};

// دالة بدء الامتحان
const handleStart = () => {
  console.log("handleStart called.");
  if (!localStorage.getItem("examState")) {
    console.log("No existing examState, randomizing questions.");
    questions.value = randomizeArray(questions.value);
  }
  quizStarted.value = true;
  console.log("Quiz started. Starting timer...");
  startTimer();
  saveState();
};

// دالة التنقل للسؤال التالي أو تقديم الامتحان
const nextQuestion = () => {
  console.log("nextQuestion called. selectedOption:", selectedOption.value);
  if (selectedOption.value !== null && currentQuestion.value) {
    examAnswers.value.push({
      q_id: currentQuestion.value.id,
      selected_option: selectedOption.value,
    });
    console.log("Answer pushed to examAnswers:", examAnswers.value);
  }
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++;
    selectedOption.value = null;
    console.log("Moved to next question. currentQuestionIndex:", currentQuestionIndex.value);
    saveState();
  } else {
    clearInterval(interval);
    quizCompleted.value = true;
    quizStarted.value = false;
    notyf.success('Congratulations! You have completed the quiz.');
    console.log("Last question answered. Submitting examAnswers:", examAnswers.value);
    submitAnswers({ answers: examAnswers.value }).then(() => {
      clearExamState();
      router.push({
        name: 'ResultPage',
        query: { message: result.value.message, score: result.value.score }
      });
    });
  }
};

// دالة حفظ الحالة في localStorage (examState)
const saveState = () => {
  const examState = {
    currentQuestionIndex: currentQuestionIndex.value,
    timeLeft: timeLeft.value,
    selectedOption: selectedOption.value,
    examAnswers: examAnswers.value,
    quizStarted: quizStarted.value,
    examId: examId.value,
    questions: questions.value,
  };
  console.log("saveState called. examState:", examState);
  localStorage.setItem("examState", JSON.stringify(examState));
};

// دالة تحميل الحالة من localStorage (examState)
const loadState = () => {
  const savedData = JSON.parse(localStorage.getItem("examState"));
  console.log("loadState called. savedData:", savedData);
  if (savedData) {
    currentQuestionIndex.value = savedData.currentQuestionIndex;
    timeLeft.value = savedData.timeLeft;
    selectedOption.value = savedData.selectedOption;
    examAnswers.value = savedData.examAnswers || [];
    quizStarted.value = savedData.quizStarted;
    examId.value = savedData.examId;
    questions.value = savedData.questions || questions.value;
    console.log("State after load:", {
      currentQuestionIndex: currentQuestionIndex.value,
      timeLeft: timeLeft.value,
      selectedOption: selectedOption.value,
      examAnswers: examAnswers.value,
      quizStarted: quizStarted.value,
      examId: examId.value,
      questions: questions.value,
    });
    if (quizStarted.value) {
      startTimer();
    }
  }
};

const clearExamState = () => {
  console.log("clearExamState called. Removing examState from localStorage...");
  localStorage.removeItem("examState");
};

onMounted(() => {
  console.log("onMounted hook. Loading state...");
  loadState();
});

watch(timeLeft, () => {
  saveState();
});
watch(currentQuestionIndex, () => {
  saveState();
});
watch(selectedOption, () => {
  saveState();
});

window.addEventListener('beforeunload', saveState);
</script>

<template>
  <div class="@container">
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-4 mt-5">Welcome to the Quiz!</h2>
    </div>
    <div class="text-center">
      <p class="text-xl font-semibold">
        Time Left:
        <span class="font-bold text-2xl text-primary border px-2 rounded-xl">
          {{ timeLeft }}
        </span>
        Seconds
      </p>
    </div>
    <div class="quiz-container">
      <div v-if="!quizStarted" class="text-center mt-4">
        <button @click="handleStart">Start Exam</button>
      </div>
      <div v-if="quizStarted">
        <div class="question-container" v-if="currentQuestion">
          <h3 class="text-xl font-bold text-center border border-gray-300 p-4 rounded-2xl shadow bg-primary text-gray-200">
            {{ currentQuestion.question_text }}
          </h3>
          <div
            v-for="(option, key) in currentQuestion.options"
            :key="key"
            class="option flex items-center gap-3 mt-2 border border-primary p-2 rounded-2xl cursor-pointer transition-all"
            :class="{ 'selected-option': selectedOption === key }"
            @click="selectedOption = key"
          >
            <input
              type="radio"
              :id="'option-' + key"
              v-model="selectedOption"
              :value="key"
              class="radio-btn"
            />
            <label :for="'option-' + key" class="w-full cursor-pointer">{{ option }}</label>
          </div>
        </div>
        <button @click="nextQuestion" :disabled="!selectedOption">
          {{ isLastQuestion ? 'Submit Exam' : 'Next Question' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  font-family: Arial, sans-serif;
  margin: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
button {
  padding: 10px 50px;
  background-color: #092c67;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}
button:hover {
  background-color: #073481;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
button:disabled {
  background-color: #ccc;
}
.selected-option {
  background-color: #d3e0ff;
  border-radius: 10px;
  padding: 10px;
  transition: background-color 0.3s ease-in-out;
}
</style>
