import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3000/scores';

const App = () => {
    const [scores, setScores] = useState({});
    const [number, setNumber] = useState('');
    const [score, setScore] = useState('');

    const handleAddScore = async () => {
        const n = parseInt(number);
        const s = parseInt(score);
        if (isNaN(n) || isNaN(s)) {
            Alert.alert('Please enter valid number and score');
            return;
        }
        if (n < 1 || n > N) {
            Alert.alert(`Number must be between 1 and ${N}`);
            return;
        }
        const newScores = { ...scores, [n]: s };
        setScores(newScores);
        setNumber('');
        setScore('');
        try {
            await axios.post(SERVER_URL, { n, s });
        } catch (error) {
            console.error(error);
            const pendingRequests = JSON.parse(await AsyncStorage.getItem('pendingRequests') || '[]');
            pendingRequests.push({ n, s });
            await AsyncStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
        }
    };

    const handleInternetConnectionChange = async (isConnected) => {
        if (isConnected) {
            const pendingRequests = JSON.parse(await AsyncStorage.getItem('pendingRequests') || '[]');
            for (const { n, s } of pendingRequests) {
                try {
                    await axios.post(SERVER_URL, { n, s });
                } catch (error) {
                    console.error(error);
                }
            }
            await AsyncStorage.removeItem('pendingRequests');
        }
    };

    return (
        <View>
            <TextInput value={number} onChangeText={setNumber} placeholder="Enter number" />
            <TextInput value={score} onChangeText={setScore} placeholder="Enter score" />
            <Button title="Add score" onPress={handleAddScore} />
        </View>
    );
};

export default App;