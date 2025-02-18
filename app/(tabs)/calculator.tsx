import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import { Equal, Minus, Plus, Percent, X, Divide, Eraser, Delete } from 'lucide-react-native';

type Operation = '+' | '-' | '×' | '÷' | null;

const CalculatorButton = memo(({ 
  text, 
  onPress, 
  type = 'number',
  size = 'normal',
  colors,
  icon,
  theme,
  useBlackout,
}: { 
  text: string; 
  onPress: () => void; 
  type?: 'number' | 'operation' | 'function';
  size?: 'normal' | 'wide';
  colors: { text: string };
  icon?: React.ReactNode;
  theme: 'light' | 'dark';
  useBlackout: boolean;
}) => {
  const getBackgroundColor = () => {
    if (theme === 'dark' && useBlackout) {
      switch (type) {
        case 'operation':
          return '#1C1C1E';
        case 'function':
          return `${colors.text}08`;
        default:
          return 'transparent';
      }
    } else {
      switch (type) {
        case 'operation':
          return `${colors.text}15`;
        case 'function':
          return `${colors.text}08`;
        default:
          return 'transparent';
      }
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          width: size === 'wide' ? 160 : 76,
        },
      ]}>
      {icon ? (
        icon
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: colors.text },
            type === 'operation' && styles.operationText,
          ]}>
          {text}
        </Text>
      )}
    </Pressable>
  );
});

CalculatorButton.displayName = 'CalculatorButton';

export default function CalculatorScreen() {
  const { colors, theme, useBlackout } = useTheme();
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [shouldReset, setShouldReset] = useState(false);
  const [equation, setEquation] = useState<string>('');

  const handleNumberPress = useCallback((num: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (shouldReset) {
      setDisplayValue(num);
      setShouldReset(false);
    } else {
      setDisplayValue(displayValue === '0' ? num : displayValue + num);
    }
  }, [displayValue, shouldReset]);

  const handleOperationPress = useCallback((op: Operation) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const currentValue = parseFloat(displayValue);
    
    if (storedValue === null) {
      setStoredValue(currentValue);
      setOperation(op);
      setShouldReset(true);
      setEquation(`${currentValue} ${op}`);
    } else if (operation) {
      const result = calculate(storedValue, currentValue, operation);
      setStoredValue(result);
      setDisplayValue(result.toString());
      setOperation(op);
      setShouldReset(true);
      setEquation(`${result} ${op}`);
    }
  }, [displayValue, storedValue, operation]);

  const handleEqualsPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (storedValue === null || !operation) return;

    const currentValue = parseFloat(displayValue);
    const result = calculate(storedValue, currentValue, operation);
    
    setEquation(`${storedValue} ${operation} ${currentValue} =`);
    setDisplayValue(result.toString());
    setStoredValue(null);
    setOperation(null);
    setShouldReset(true);
  }, [displayValue, storedValue, operation]);

  const handleClearPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setDisplayValue('0');
    setStoredValue(null);
    setOperation(null);
    setEquation('');
  }, []);

  const handleBackspacePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDisplayValue((current) => {
      if (current.length <= 1) return '0';
      return current.slice(0, -1);
    });
  }, []);

  const handleDecimalPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [displayValue]);

  const calculate = (a: number, b: number, op: Operation): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[
        styles.calculatorContainer,
        { backgroundColor: colors.background },
      ]}>
        <View style={styles.display}>
          <Text
            style={[
              styles.displayText,
              { color: colors.text },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {displayValue}
          </Text>
          <Text
            style={[
              styles.equationText,
              { color: colors.textSecondary },
            ]}>
            {equation}
          </Text>
        </View>

        <View style={styles.buttonGrid}>
          <View style={styles.row}>
            <CalculatorButton 
              text="C" 
              onPress={handleClearPress} 
              type="function" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<Eraser size={24} color={colors.text} />}
            />
            <CalculatorButton 
              text="⌫" 
              onPress={handleBackspacePress} 
              type="function" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<Delete size={24} color={colors.text} />}
            />
            <CalculatorButton 
              text="%" 
              onPress={() => {
                const value = parseFloat(displayValue);
                setDisplayValue((value / 100).toString());
              }} 
              type="function" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<Percent size={24} color={colors.text} />}
            />
            <CalculatorButton 
              text="÷" 
              onPress={() => handleOperationPress('÷')} 
              type="operation" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<Divide size={24} color={colors.text} />}
            />
          </View>

          <View style={styles.row}>
            <CalculatorButton text="7" onPress={() => handleNumberPress('7')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton text="8" onPress={() => handleNumberPress('8')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton text="9" onPress={() => handleNumberPress('9')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton 
              text="×" 
              onPress={() => handleOperationPress('×')} 
              type="operation" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<X size={24} color={colors.text} />}
            />
          </View>

          <View style={styles.row}>
            <CalculatorButton text="4" onPress={() => handleNumberPress('4')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton text="5" onPress={() => handleNumberPress('5')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton text="6" onPress={() => handleNumberPress('6')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton 
              text="-" 
              onPress={() => handleOperationPress('-')} 
              type="operation" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<Minus size={24} color={colors.text} />}
            />
          </View>

          <View style={styles.row}>
            <CalculatorButton text="1" onPress={() => handleNumberPress('1')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton text="2" onPress={() => handleNumberPress('2')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton text="3" onPress={() => handleNumberPress('3')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton 
              text="+" 
              onPress={() => handleOperationPress('+')} 
              type="operation" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<Plus size={24} color={colors.text} />}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.spacer} />
            <CalculatorButton text="0" onPress={() => handleNumberPress('0')} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton text="." onPress={handleDecimalPress} colors={colors} theme={theme} useBlackout={useBlackout} />
            <CalculatorButton 
              text="=" 
              onPress={handleEqualsPress} 
              type="operation" 
              colors={colors}
              theme={theme}
              useBlackout={useBlackout}
              icon={<Equal size={24} color={colors.text} />}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  calculatorContainer: {
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  display: {
    alignItems: 'flex-end',
    padding: 20,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 64,
    fontWeight: '700',
  },
  equationText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  buttonGrid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spacer: {
    width: 76,
  },
  button: {
    height: 76,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '700',
  },
  operationText: {
    fontWeight: '700',
  },
});