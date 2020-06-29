"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const {
    dialogflow,
    BasicCard,
    Image,
    Button,
    Suggestions,
    LinkOutSuggestion,
    Carousel,
    Table,
    List
} = require("actions-on-google");

const assistant = dialogflow({ debug: true });

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const truth = [
    'Who do you think is the worst dressed person in this room?',
    'What is your worst habit?',
    'Who is your secret crush?',
    'What dont you like about me?',
    'Have you ever tasted your sweat?',
    'Who in this room would be the worst person to date and Why?',
    'If you could suddenly become invisible, what would you do?',
    'Describe the strangest dream you`ve ever had. Did you like it?',
    'Have you ever posted something on social media that you regret?',
    'Tell us about a time you embarrassed yourself in front of a crush'
];
const dare = [
    'Propose to someone in the room',
    'Talk in a strange accent',
    'Get a phone number from a new person',
    'Describe What The Sky Looks Like Without Using The Words Blue Or White',
    'Talk in Telugu without using any english word'
];
const players = [];
const answers = [
    'Oh I liked it',
    'Thats funny',
    'You are rocking'
];


assistant.intent("Default Welcome Intent", conv => {
    conv.ask('Hello, Welcome to your favourite Truth or Dare. May I know the number of players please')
});

assistant.intent('PlayersNumberIntent', conv => {
    const playersnumber = conv.parameters.number;
    conv.ask(`Fantastic ! May I know the ${playersnumber} players who's going to rock with me `) 
    conv.contexts.set('no-of-players',2,{numberofplayers: `${playersnumber}`})
})

assistant.intent('PlayersNameIntent', conv => {
    let speechText = '';
    const playersnumber = conv.contexts.get('no-of-players').parameters.numberofplayers;
    console.log('-----------',playersnumber);
    if(playersnumber === '2'){
        const player1 = conv.parameters.name
        const player2 = conv.parameters.name1 
        console.log('+++++++++',player1,player2);
        conv.contexts.set('player-names', 2 , { numberofplayers : `${playersnumber}`, player1 : `${player1}`, player2 : `${player2}`})
        speechText = `Shall we start the game ${player1} and ${player2}`
    }
    else if(playersnumber === '4'){
        const player1 = conv.parameters.name
        const player2 = conv.parameters.name1         
        const player3 = conv.parameters.name2
        const player4 = conv.parameters.name3
        console.log('/////////',player1,player2,player3,player4);
        conv.contexts.set('player-names', 2 , {numberofplayers : `${playersnumber}`, player1 : `${player1}`, player2 : `${player2}`, player3 : `${player3}`, player4 : `${player4}`})
        speechText = `Ok then, shall we start the game my dear friends`
    }
    conv.ask(speechText);
})

assistant.intent('Start', conv =>{
    const contexts = conv.contexts.get('player-names');
    console.log('********', contexts);
    const n = conv.contexts.get('player-names').parameters.numberofplayers;
    if(n === '2'){
        const p1 = conv.contexts.get('player-names').parameters.player1
        const p2 = conv.contexts.get('player-names').parameters.player2       
        players.push(p1,p2);
        console.log('..........', p1,p2);
        console.log('..........', players);
    }
    else if(n === '4'){
        const p1 = conv.contexts.get('player-names').parameters.player1
        const p2 = conv.contexts.get('player-names').parameters.player2
        const p3 = conv.contexts.get('player-names').parameters.player3
        const p4 = conv.contexts.get('player-names').parameters.player4
        players.push(p1,p2,p3,p4);
        console.log('..........', p1,p2,p3,p4);
        console.log('..........', players);
    }
    const selectedPlayer = players[Math.floor(Math.random() * players.length)];
    console.log('#######',selectedPlayer);
    conv.ask(`Hey ${selectedPlayer} it's your turn. Would you like to choose Truth or Dare ?`);
})

assistant.intent('Truth', conv =>{
    const selectedQuestion = truth[Math.floor(Math.random() * truth.length)];
    console.log('$$$$$$$$',selectedQuestion);
    conv.contexts.set('repeat-question',2, {question : `${selectedQuestion}`});
    const ssml =
    '<speak>' +
    `Ok, here is your question <break time="1.5" /> ${selectedQuestion} <break time="10" />` +
    '</speak>';
    conv.ask(ssml);
    const selectedAnswer = answers[Math.floor(Math.random() * answers.length)];
    console.log('$$$$$$$$',selectedAnswer);
    conv.ask(`${selectedAnswer}. Shall I continue the game`);
    conv.contexts.set('continue',2,{continue : 'yes'});
})

assistant.intent('Dare', conv =>{
    const selectedQuestion = dare[Math.floor(Math.random() * dare.length)];
    console.log('$$$$$$$$',selectedQuestion);
    conv.contexts.set('repeat-question',2, {question : `${selectedQuestion}`});
    const ssml =
    '<speak>' +
    `Ok, here is your question <break time="1.5" /> ${selectedQuestion} <break time="10" />` +
    '</speak>';
    conv.ask(ssml);
    const selectedAnswer = answers[Math.floor(Math.random() * answers.length)];
    console.log('$$$$$$$$',selectedAnswer);
    conv.ask(`${selectedAnswer}. Shall I continue the game`);
    conv.contexts.set('continue',2,{continue : 'yes'});
})

assistant.intent('Continue', conv => {
    const context = conv.contexts.get('continue');
    console.log('kkkkkkkkk',context);
    const selectedPlayer = players[Math.floor(Math.random() * players.length)];
    console.log('#######',selectedPlayer);
    conv.ask(`Hey ${selectedPlayer} it's your turn. Would you like to choose Truth or Dare ?`);

})

assistant.intent('Repeat', conv => {
    let speechText = '';
    const repeatQuestion = conv.contexts.get('repeat-question').parameters.question;
    console.log('rrrrrrrrrr',repeatQuestion);
    const ssml =
    '<speak>' +
    `No problem <break time="1.5" /> ${repeatQuestion} <break time="10" />` +
    '</speak>';
    conv.ask(ssml);
    const selectedAnswer = answers[Math.floor(Math.random() * players.length)];
    console.log('$$$$$$$$',selectedAnswer);
    conv.ask(`${selectedAnswer}. Shall I continue the game`);
    conv.contexts.set('continue',2,{continue : 'yes'});
})
// Main Route
app.post("/", assistant);

app.get("/", (req, res) => {
    res.send("server running");
});

app.listen(process.env.PORT || 6000, function () {
    console.log("Express app started on port 6000");
});
