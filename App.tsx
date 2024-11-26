import React, {useEffect, useState} from 'react';
import {Text, TextInput, StyleSheet, Pressable, ScrollView, Platform} from 'react-native';
import axios from 'axios';
interface CalculationRequest {
  num1: number;
  num2: number;
  operator: string;
}

interface CalculationResponse {
  result: number;
  error?: string;
}

interface ImplicitResponse {
  implicitResult: number;
  name: string;
}

const App = () => {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operator, setOperator] = useState<string>('');
  const [result, setResult] = useState<string | number>('');
  const [implicitResult, setImplicitResult] = useState<string | number>(
    'Loading...',
  );
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      setBaseURL('http://10.0.2.2');
    } else {
      setBaseURL('http://127.0.0.1');
    }
  }, []);

  useEffect(() => {
    const fetchStringData = async () => {
      try {
        const response = await axios.get<ImplicitResponse>(
          `${baseURL}:5001/stringconcepts`,
        );
        if (response && response.data) {
          setImplicitResult(response.data.implicitResult);
          setName(response.data.name);
        } else {
          console.log('StringConcepts: Error');
          setImplicitResult('Error fetching implicit result.');
        }
      } catch (err: any) {
        console.error('Error: Failed to fetch string results.');
        setImplicitResult('Failed to fetch string results.');
      }
    };
    fetchStringData();
  }, [baseURL]);

  // Function to handle calculation
  const calculate = async () => {
    if (!num1 || !num2 || !operator) {
      setError('All fields are required.');
      return;
    }

    const validOperators = ['+', '-', '*', '/'];
    if (!validOperators.includes(operator)) {
      setError('Invalid operator. Use +, -, *, or /.');
      return;
    }

    try {
      const data: CalculationRequest = {
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        operator,
      };

      const response = await axios.post<CalculationResponse>(
        `${baseURL}:5000/calculate`,
        data,
      );

      if (response.data.error) {
        setError(response.data.error);
        setResult('');
      } else {
        setResult(response.data.result);
        setError('');
      }
    } catch (err) {
      setError('Failed to connect to the backend. Please try again.');
      setResult('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter first number"
        keyboardType="numeric"
        onChangeText={setNum1}
        value={num1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter operator (+, -, *, /)"
        onChangeText={setOperator}
        value={operator}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter second number"
        keyboardType="numeric"
        onChangeText={setNum2}
        value={num2}
      />

      <Pressable onPress={calculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </Pressable>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        result !== '' && <Text style={styles.result}>Result: {result}</Text>
      )}

      <Text style={styles.heading}>String Concepts</Text>
      {implicitResult !== '' && implicitResult !== 'Loading...' && (
        <Text style={styles.implicitText}>
          Implicit Result: {implicitResult}
        </Text>
      )}
      {name !== '' && name !== 'Loading...' && (
        <Text style={styles.implicitText}>
          Name: {name}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: '20%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'left',
    color: 'green',
  },
  buttonText: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    width: '22%',
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  implicitText: {
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'left',
  },
});

export default App;
