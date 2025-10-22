// WebSocket Composable for Real-time Updates
import type { Ref } from 'vue';
import type { StockUpdateMessage, MarketStatusMessage, WebSocketMessage } from '~/types/api';

export const useWebSocket = (url?: string) => {
  const config = useRuntimeConfig();
  const useMockMode = config.public.useMockData !== false;

  const socket: Ref<WebSocket | null> = ref(null);
  const isConnected = ref(false);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const listeners: Map<string, Set<(data: any) => void>> = new Map();

  // Mock data generation for simulating real-time updates
  const mockData = useMockData();
  let mockInterval: ReturnType<typeof setInterval> | null = null;

  const connect = () => {
    if (useMockMode) {
      // Simulate WebSocket connection with mock data
      isConnected.value = true;
      startMockUpdates();
      return;
    }

    try {
      const wsUrl = url || config.public.wsUrl || 'ws://localhost:3001';
      socket.value = new WebSocket(wsUrl);

      socket.value.onopen = () => {
        console.log('WebSocket connected');
        isConnected.value = true;
        reconnectAttempts.value = 0;
      };

      socket.value.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.value.onclose = () => {
        console.log('WebSocket disconnected');
        isConnected.value = false;

        // Attempt to reconnect
        if (reconnectAttempts.value < maxReconnectAttempts) {
          reconnectAttempts.value++;
          setTimeout(() => {
            console.log(`Reconnecting... (Attempt ${reconnectAttempts.value})`);
            connect();
          }, reconnectDelay);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  };

  const disconnect = () => {
    if (mockInterval) {
      clearInterval(mockInterval);
      mockInterval = null;
    }

    if (socket.value) {
      socket.value.close();
      socket.value = null;
    }

    isConnected.value = false;
  };

  const send = (type: string, payload: any) => {
    const message = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  };

  const handleMessage = (message: WebSocketMessage) => {
    const typeListeners = listeners.get(message.type);
    if (typeListeners) {
      typeListeners.forEach(callback => callback(message.payload));
    }

    // Also notify wildcard listeners
    const wildcardListeners = listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(callback => callback(message));
    }
  };

  const on = (type: string, callback: (data: any) => void) => {
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const typeListeners = listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
      }
    };
  };

  const off = (type: string, callback?: (data: any) => void) => {
    if (!callback) {
      listeners.delete(type);
    } else {
      const typeListeners = listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
      }
    }
  };

  // Simulate real-time stock updates with mock data
  const startMockUpdates = () => {
    if (!useMockMode) return;

    mockInterval = setInterval(() => {
      // Generate random stock update
      const stock = mockData.generateStock();
      const updateMessage: StockUpdateMessage = {
        type: 'stock.update',
        payload: {
          symbol: stock.symbol,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
          volume: stock.volume,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };

      handleMessage(updateMessage);
    }, 2000); // Update every 2 seconds

    // Simulate market status updates
    const marketStatusInterval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const isMarketHours = hour >= 9 && hour < 16;

      const statusMessage: MarketStatusMessage = {
        type: 'market.status',
        payload: {
          isOpen: isMarketHours,
          nextOpen: isMarketHours ? undefined : 'Tomorrow 9:30 AM',
          nextClose: isMarketHours ? 'Today 4:00 PM' : undefined,
        },
        timestamp: new Date().toISOString(),
      };

      handleMessage(statusMessage);
    }, 60000); // Update every minute

    // Clean up on disconnect
    onUnmounted(() => {
      if (mockInterval) clearInterval(mockInterval);
      if (marketStatusInterval) clearInterval(marketStatusInterval);
    });
  };

  // Subscribe to stock updates
  const subscribeToStock = (symbol: string) => {
    if (useMockMode) {
      // In mock mode, we're already sending updates for all stocks
      return;
    }

    send('subscribe', { type: 'stock', symbol });
  };

  const unsubscribeFromStock = (symbol: string) => {
    if (useMockMode) {
      return;
    }

    send('unsubscribe', { type: 'stock', symbol });
  };

  // Auto-connect on mount (can be disabled by not calling connect)
  onMounted(() => {
    // Auto-connect is optional - call connect() manually if needed
  });

  // Auto-disconnect on unmount
  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    send,
    on,
    off,
    subscribeToStock,
    unsubscribeFromStock,
  };
};
