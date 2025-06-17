import { formatDistanceToNow } from 'date-fns';

export const getCodeContent = (fileName: string): string => {
  const fileMap: Record<string, string> = {
    "Header.tsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="E-commerce Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">ShopEase</span>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Categories
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                to="/cart"
                className="relative p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">3</span>
              </Link>
            </div>
            <div className="ml-4">
              <Link
                to="/account"
                className="p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <User className="h-6 w-6" />
              </Link>
            </div>
            <div className="ml-4 md:hidden">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;`,
    "ProductCard.tsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  rating,
  reviewCount,
}) => {
  return (
    <div className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-4 aspect-h-3 bg-gray-200 group-hover:opacity-75">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="px-4 py-3">
        <Link to={\`/product/\${id}\`}>
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        </Link>
        <div className="mt-1 flex items-center">
          <p className="text-lg font-semibold text-gray-900">\${price.toFixed(2)}</p>
        </div>
        <div className="mt-1 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={\`h-4 w-4 \${
                i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
              }\`}
              fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
            />
          ))}
          <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
        </div>
        <div className="mt-3">
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;`,
    "App.tsx": `
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;`,
    "Dashboard.js": `
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      setBalance(5249.78);
      setRecentTransactions([
        { id: 1, type: 'payment', amount: -85.25, description: 'Electric Bill', date: '2023-10-12' },
        { id: 2, type: 'deposit', amount: 1250.00, description: 'Paycheck', date: '2023-10-10' },
        { id: 3, type: 'payment', amount: -35.48, description: 'Grocery Store', date: '2023-10-09' },
        { id: 4, type: 'transfer', amount: -200.00, description: 'Transfer to Savings', date: '2023-10-07' },
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching account data:', error);
      setIsLoading(false);
    }
  };

  // Define spendingData for the chart
  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2000, 1800, 2200, 1900, 2100, 1850],
      },
    ],
  };

  // Define chartConfig
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => \`rgba(33, 150, 243, \${opacity})\`,
    strokeWidth: 2,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}</Text>
            <Text style={styles.subGreeting}>Welcome back to your dashboard</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileIcon}>
              <Icon name="account" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>\${balance.toFixed(2)}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Transfer')}
              >
                <Icon name="bank-transfer" size={20} color="#2196F3" />
                <Text style={styles.actionButtonText}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Deposit')}
              >
                <Icon name="cash-plus" size={20} color="#2196F3" />
                <Text style={styles.actionButtonText}>Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('PayBill')}
              >
                <Icon name="file-document" size={20} color="#2196F3" />
                <Text style={styles.actionButtonText}>Pay Bill</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} style={styles.transactionCard}>
              <Card.Content style={styles.transactionContent}>
                <View style={styles.transactionIcon}>
                  <Icon
                    name={
                      transaction.type === 'payment'
                        ? 'cash-minus'
                        : transaction.type === 'deposit'
                        ? 'cash-plus'
                        : 'bank-transfer'
                    }
                    size={24}
                    color={transaction.amount > 0 ? '#4CAF50' : '#F44336'}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: transaction.amount > 0 ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}\${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Overview</Text>
          <Card style={styles.chartCard}>
            <Card.Content>
              <BarChart
                data={spendingData}
                width={320}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                fromZero
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#2196F3',
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#2196F3',
  },
  transactionCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartCard: {
    borderRadius: 12,
    marginTop: 12,
  },
});

export default Dashboard;`,
    "LineChart.vue": `
<template>
  <div class="line-chart-container">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-controls">
      <div class="timeframe-selector">
        <button 
          v-for="option in timeframeOptions" 
          :key="option.value"
          @click="selectedTimeframe = option.value"
          :class="['timeframe-btn', { active: selectedTimeframe === option.value }]"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="chart-legend">
        <div v-for="(dataset, index) in chartData.datasets" :key="index" class="legend-item">
          <span class="legend-color" :style="{ backgroundColor: dataset.borderColor }"></span>
          <span class="legend-label">{{ dataset.label }}</span>
        </div>
      </div>
    </div>
    <canvas ref="lineChart" height="300"></canvas>
    <div class="chart-footer">
      <div v-if="showMetrics" class="metrics">
        <div class="metric">
          <span class="metric-label">Avg</span>
          <span class="metric-value">{{ formatValue(averageValue) }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Min</span>
          <span class="metric-value">{{ formatValue(minValue) }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Max</span>
          <span class="metric-value">{{ formatValue(maxValue) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'LineChart',
  props: {
    title: {
      type: String,
      default: 'Line Chart'
    },
    datasets: {
      type: Array,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    showMetrics: {
      type: Boolean,
      default: true
    },
    formatValue: {
      type: Function,
      default: value => value
    }
  },
  setup(props) {
    const lineChart = ref(null);
    const chartInstance = ref(null);
    const selectedTimeframe = ref('week');
    
    const timeframeOptions = [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year' }
    ];
    
    const chartData = computed(() => {
      return {
        labels: props.labels,
        datasets: props.datasets
      };
    });
    
    const averageValue = computed(() => {
      const allValues = props.datasets.flatMap(dataset => dataset.data);
      return allValues.reduce((sum, value) => sum + value, 0) / allValues.length;
    });
    
    const minValue = computed(() => {
      const allValues = props.datasets.flatMap(dataset => dataset.data);
      return Math.min(...allValues);
    });
    
    const maxValue = computed(() => {
      const allValues = props.datasets.flatMap(dataset => dataset.data);
      return Math.max(...allValues);
    });
    
    const createChart = () => {
      const ctx = lineChart.value.getContext('2d');
      
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
      
      chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: chartData.value,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    };
    
    watch(() => props.datasets, () => {
      createChart();
    }, { deep: true });
    
    watch(selectedTimeframe, () => {
      console.log('Timeframe changed to', selectedTimeframe.value);
    });
    
    onMounted(() => {
      createChart();
    });
    
    return {
      lineChart,
      selectedTimeframe,
      timeframeOptions,
      chartData,
      averageValue,
      minValue,
      maxValue
    };
  }
}
</script>

<style scoped>
.line-chart-container {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timeframe-selector {
  display: flex;
  gap: 8px;
}

.timeframe-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.timeframe-btn.active {
  background-color: #e0f2fe;
  color: #0369a1;
  font-weight: 500;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  font-size: 12px;
  color: #666;
}

.chart-footer {
  margin-top: 12px;
}

.metrics {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 12px;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
</style>`
  };

  return fileMap[fileName] || "";
};