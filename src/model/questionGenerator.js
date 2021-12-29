import randomNumbers from './utilities/randomNumbers';
import randomValueFromArray from './utilities/randomValueFromArray';

const charactersTypeData = (data) => {
  return data.map(({ name, img }) => ({
    answer: name,
    questionObject: img,
  }));
};

const quoteTypeData = (data) => {
  return data.map(({ quote, author }) => ({
    answer: author,
    questionObject: quote,
  }));
};

const deathTypeData = (data) => {
  return data.map(({ death, cause }) => ({
    answer: death,
    questionObject: cause,
  }));
};

async function fetchData(type) {
  const response = await fetch(`https://breakingbadapi.com/api/${type}`);
  const data = await response.json();
  if (type === 'characters') {
    return charactersTypeData(data);
  }
  if (type === 'quotes') {
    return quoteTypeData(data);
  }
  if (type === 'deaths') {
    return deathTypeData(data);
  }
  return 'Wrong type';
}

const areAllDifferent = (filtredAnswers) => {
  const answers = [...filtredAnswers.map(({ answer }) => answer)];
  while (answers.length !== 1) {
    const answer = answers.pop();
    if (answers.includes(answer)) {
      return false;
    }
  }
  return true;
};

const questionGenerator = async (category) => {
  const data = await fetchData(category);

  const askedQuestionIndexes = [];
  const askedQuestions = [];
  const playersIndexes = {};

  const addNewQuestion = () => {
    let answersIndexes;
    let correctAnswerIndex;
    let areAnswersDifferent;
    do {
      answersIndexes = randomNumbers(0, data.length - 1, 4);
      correctAnswerIndex = randomValueFromArray(answersIndexes);
      const filtredAnswers = data.filter((_, index) => answersIndexes.includes(index));
      areAnswersDifferent = areAllDifferent(filtredAnswers);
    } while (!areAnswersDifferent || askedQuestionIndexes.includes(correctAnswerIndex));
    askedQuestionIndexes.push(correctAnswerIndex);
    askedQuestions.push({
      answers: data
        .filter((_, index) => answersIndexes.includes(index))
        .map(({ answer }) => answer),
      correctAnswer: data[correctAnswerIndex].answer,
      questionObject: data[correctAnswerIndex].questionObject,
    });
  };

  questionGenerator.getQuestion = (playerName) => {
    playersIndexes[playerName] =
      typeof playersIndexes[playerName] === 'undefined' ? 0 : playersIndexes[playerName] + 1;
    if (askedQuestions.length === playersIndexes[playerName]) {
      addNewQuestion();
    }
    return askedQuestions[playersIndexes[playerName]];
  };
};

export default questionGenerator;
