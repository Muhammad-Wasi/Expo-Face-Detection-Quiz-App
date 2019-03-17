import React from 'react';
import { Text, View, TouchableOpacity, Button, CheckBox, StyleSheet, Alert } from 'react-native';
import { Camera, Permissions, FaceDetector } from 'expo';
import { black } from 'ansi-colors';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      text: '',
      quiz: '',
      quizes: [],
      count: 0,
      correctAnswer: 0,
      checked: '',
      playAgain: '',
      time: '',
      result: []
    }

    this.handleFacesDetected = this.handleFacesDetected.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
    this.quizGoingOn = this.quizGoingOn.bind(this);
    this.next = this.next.bind(this);
    this.done = this.done.bind(this);
    this.playagain = this.playagain.bind(this)

  }

  componentWillMount() {
    const url = "https://opentdb.com/api.php?amount=10&type=multiple"
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        console.log('Data', JSON.parse(JSON.stringify(myJson)));
        this.setState({ quizes: JSON.parse(JSON.stringify(myJson)).results })
      });
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  handleFacesDetected(e) {
    const faceArr = e.faces.length;
    if (faceArr) {
      console.log('faceArr*********', faceArr)
      this.setState({ quiz: 'start' })
      this.setState({ hasCameraPermission: false, text: "Face Detected" })

    }
    else {
      console.log('face*********', faceArr)
      this.setState({ text: "Don't found any face..." })
    }
  }

  startQuiz() {
    setTimeout(() => {
      this.setState({ quiz: 'timeStart' })
    }, 1000)
  }

  quizGoingOn() {
    console.log('new Date().getTime()****', new Date().getTime())
    setTimeout(() => {
      this.setState({
        quiz: 'goingOn',
        startTime: new Date().getTime()
      })
    }, 1000)
  }

  next() {
    const { count, quizes, checked, correctAnswer } = this.state;
    const correctanswer = quizes[count].correct_answer;
    if (count < 9 && checked) {
      if (correctanswer === checked) {
        this.setState({ correctAnswer: correctAnswer + 1 })
      }
      else {
        this.setState({ correctAnswer })
      }
      this.setState({
        count: count + 1,
        checked: ''
      })
    }
    else {
      alert('Not Selected')
    }
  }

  done() {
    const { count, quizes, checked, correctAnswer, startTime, result } = this.state;
    console.log('startTime*******', startTime)
    const totalTime = new Date().getTime() - startTime;
    console.log('totalTime*******', totalTime)
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const hours = Math.floor((totalTime % (day)) / (hour));
    const minutes = Math.floor((totalTime % (hour)) / (minute));
    const seconds = Math.floor((totalTime % (minute)) / second);
    let time;
    if (hours < 10 && minutes < 10 && seconds < 10) {
      time = `0${hours}:0${minutes}:0${seconds}`
    }
    else if (hours < 10 && minutes < 10 && seconds > 9) {
      time = `0${hours}:0${minutes}:${seconds}`
    }
    else if (hours < 10 && minutes > 9 && seconds < 10) {
      time = `0${hours}:${minutes}:$0{seconds}`
    }
    else if (hours > 9 && minutes < 10 && seconds < 10) {
      time = `${hours}:0${minutes}:0${seconds}`
    }
    else if (hours < 10 && minutes > 9 && seconds > 9) {
      time = `0${hours}:${minutes}:${seconds}`
    }
    else if (hours > 9 && minutes < 10 && seconds > 9) {
      time = `${hours}:0${minutes}:${seconds}`
    }
    else if (hours > 9 && minutes > 9 && seconds < 10) {
      time = `0${hours}:0${minutes}:0${seconds}`
    }
    else if (hours > 9 && minutes > 9 && seconds > 9) {
      time = `${hours}:${minutes}:${seconds}`
    }


    // var hours = totalTime.getHours();
    // var minutes = totalTime.getMinutes();
    // var seconds = totalTime.getSeconds();
    console.log('Time****', hours + ':' + minutes + ':' + seconds)
    console.log('Time*******************', time)
    const correctanswer = quizes[count].correct_answer;
    if (checked) {
      if (correctanswer === checked) {
        this.setState({ correctAnswer: correctAnswer + 1, result: [...result, { correctAnswer: correctAnswer + 1, time }] })
      }
      else {
        this.setState({ correctAnswer, result: [...result, { correctAnswer, time }] })
      }
      this.setState({
        playAgain: 'PlayAgain',
        count: count + 1,
        checked: '',
        time
      })
    }
    else {
      alert('Not Selected Done')
    }
  }

  playagain() {
    const url = "https://opentdb.com/api.php?amount=10&type=multiple"
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        console.log('Data', JSON.parse(JSON.stringify(myJson)));
        this.setState({ quizes: JSON.parse(JSON.stringify(myJson)).results })
      });
    this.setState({
      count: 0,
      playAgain: '',
      correctAnswer: 0,
      startTime: new Date().getTime()
    })
  }

  render() {
    const { hasCameraPermission, quiz, quizes, count, checked, correctAnswer, time, result } = this.state;
    console.log(checked, 'asas')
    return (
      <View style={{ flex: 1, marginTop: 12 }}>
        <View style={{ marginTop: 0, backgroundColor: 'orange', height: 50, textAlign: 'center' }}>
          <Text style={{ fontSize: 22, color: 'white', textAlign: 'center', paddingTop: 10 }} >Quiz App</Text>
        </View>
        {
          hasCameraPermission === null &&
          !quiz &&
          <View>
            <Text>hasCameraPermission</Text>
          </View>
        }

        {
          hasCameraPermission === false &&
          !quiz &&
          <Text>No access to camera</Text>
        }
        {
          hasCameraPermission !== null && hasCameraPermission !== false &&
          !quiz &&
          <View>
            <Camera style={{ width: '100%', height: '80%' }} type={this.state.type}

              onFacesDetected={this.handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.Constants.Mode.fast,
                detectLandmarks: FaceDetector.Constants.Mode.none,
                runClassifications: FaceDetector.Constants.Mode.none,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    })
                  }}>
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                    {' '}Flip{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </Camera>
            <View style={{ width: '100%', height: 100 }}>

            </View>
          </View>
        }

        {
          quiz === 'start' &&
          <View style={styles.container} >
            <Button
              onPress={this.startQuiz}
              title="Start Quiz"
              color="orange"
            />
          </View>
        }
        {
          quiz === 'timeStart' &&
          <View style={styles.container} >
            <Button
              onPress={this.quizGoingOn}
              title="Click To Show The Quiz"
              color="orange"
            />
          </View>
        }
        {
          quiz === 'goingOn' && count != 10 &&
          <View>
            {
              quizes.length &&
              <View style={styles.quiz}>
                <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 10 }}>Question {count + 1}</Text>
                <Text style={styles.question}>{quizes[count].question}</Text>
                <View style={styles.options}>
                  <View style={{ flexWrap: "wrap" }}>
                    <TouchableOpacity
                      style={checked === quizes[count].correct_answer ? styles.focus : styles.blueView}
                      onPress={() => { this.setState({ checked: quizes[count].correct_answer }) }}
                    >
                      <Text
                        style={checked === quizes[count].correct_answer ? styles.focusText : styles.blurText}
                      >
                        a) {quizes[count].correct_answer}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {
                    quizes[count].incorrect_answers.map((item, index) => {
                      return <View style={{ flexDirection: 'column' }} >
                        <TouchableOpacity
                          style={checked === item ? styles.focus : styles.blueView}
                          onPress={() => { this.setState({ checked: item }) }}
                        >
                          <Text
                            style={checked === item ? styles.focusText : styles.blurText}
                          >
                            {index == 0 && 'b) '}
                            {index == 1 && 'c) '}
                            {index == 2 && 'd) '}
                            {item}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    })
                  }
                </View>
                <View style={styles.button}>
                  {
                    count == 9 ?
                      <Button
                        onPress={this.done}
                        title="Done"
                        color="orange"
                      />
                      :
                      <Button
                        onPress={this.next}
                        title="Next"
                        color="orange"
                      />
                  }
                </View>
              </View>
            }
          </View>
        }

        {
          count == 10 ?
            <View style={styles.container}>
              {
                result.map(item => {
                  return <View style={styles.resultView}>
                    <Text style={styles.result} >Score {(`${item.correctAnswer}` / 10) * 100}%</Text>
                    {
                      (`${item.correctAnswer}` / 10) * 100 > 50 ?
                        <Text>Passed</Text>
                        :
                        <Text>Failed</Text>
                    }
                    <Text>Total Time: {item.time}</Text>
                  </View>

                })
              }
              <View style={styles.button}>
                <Button
                  onPress={this.playagain}
                  title="Play Again"
                  color="orange"
                />
              </View>
            </View>
            :
            null
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quiz: {
    color: 'grey',
    marginTop: 30,
  },
  question: {
    paddingLeft: 15,
    fontSize: 20
  },
  options: {
    fontSize: 18,
    padding: 5,
    margin: 20,
    borderRadius: 5
  },
  button: {
    // marginTop: 20,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40,
  },
  focus: {
    borderRadius: 5,
    backgroundColor: 'orange',
    fontSize: 19,
    padding: 8
  },
  focusText: {
    color: '#ffffff',
  },
  blurText: {
    color: 'black',
  },
  blueView: {
    backgroundColor: 'white',
    fontSize: 18,
    padding: 8
  },
  result: {
    fontSize: 22
  },
  resultView: {
    borderColor: 'orange',
    borderRadius: 5
  }
});