/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log(question);
  // We only remove whether the answer is correct or not
  const removeCorrect = [];
  question.answer.map(ans => {
    removeCorrect.push({id: ans.id, text: ans.text});
  })
  // const removeCorrect = newQuestion.answer.map(ans => {
  //   delete ans['correct'];
  //   return ans;
  // })
  console.log(removeCorrect);
  // console.log('See answers: ', removeCorrect);
  return {
    questionId: question.questionId,
    type: question.type,
    text: question.text,
    timeLimit: question.timeLimit,
    points: question.points,
    answer: removeCorrect,
    attachmentType: question.attachmentType,
    attachmentFile: question.attachmentFile
  };
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  // Filter out the correct answers
  const answers = question.answer;
  console.log(question);
  // console.log(answers)
  return answers.filter(ans => ans.correct).map(ans => ans.id);
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  // console.log(question);
  const answers = question.answer;
  return answers.map(ans => ans.id);
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.timeLimit;
};
