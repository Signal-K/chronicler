import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { InventoryData } from '../../hooks/useGameState';
import { canFulfillOrder, fulfillOrder, getMissingItems } from '../../lib/orderFulfillment';
import { loadActiveOrders } from '../../lib/orderGeneration';
import type { Order } from '../../types/orders';
import { CoinIcon, OrderBoxIcon } from '../ui/ShopIcons';

interface OrdersModalProps {
  visible: boolean;
  onClose: () => void;
  inventory: InventoryData;
  setInventory: (inventory: InventoryData) => void;
}

export function OrdersModal({
  visible,
  onClose,
  inventory,
  setInventory,
}: OrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (visible) {
      loadOrders();
    }
  }, [visible]);

  const loadOrders = async () => {
    const loadedOrders = await loadActiveOrders();
    setOrders(loadedOrders);
  };

  const handleFulfillOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Check if can fulfill
    if (!canFulfillOrder(order, inventory)) {
      const missing = getMissingItems(order, inventory);
      Alert.alert(
        "Cannot Fulfill Order",
        `You need: ${missing.join(', ')}`,
        [{ text: "OK" }]
      );
      return;
    }

    const result = await fulfillOrder(orderId, inventory);
    if (result) {
      setInventory(result.updatedInventory);
      await loadOrders(); // Refresh order list
      Alert.alert(
        "Order Completed! 🎉",
        `You earned ${result.reward} coins!`,
        [{ text: "Great!" }]
      );
    } else {
      Alert.alert(
        "Order Failed",
        "This order has expired or cannot be fulfilled.",
        [{ text: "OK" }]
      );
    }
  };

  const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const renderOrder = (order: Order) => {
    let requirementsText = '';
    let requirementsEmoji = '';

    if (order.type === 'crop') {
      requirementsText = `${order.quantity}x ${order.cropType}`;
      requirementsEmoji = order.cropEmoji;
    } else if (order.type === 'crop-group') {
      requirementsText = order.requirements
        .map(r => `${r.quantity}x ${r.cropType}`)
        .join(', ');
      requirementsEmoji = order.requirements.map(r => r.cropEmoji).join(' ');
    } else if (order.type === 'nectar') {
      requirementsText = `${order.bottlesRequired}x Bottled Nectar`;
      requirementsEmoji = '🍯';
    }

    const isExpired = order.status === 'expired' || order.expiresAt < Date.now();
    const canFulfill = !isExpired && canFulfillOrder(order, inventory);

    return (
      <View key={order.id} style={[styles.orderCard, isExpired && styles.orderCardExpired]}>
        {/* Header with merchant and time */}
        <View style={styles.orderHeader}>
          <View style={styles.merchantBadge}>
            <Text style={styles.merchantIcon}>👤</Text>
            <Text style={styles.merchantName} numberOfLines={1}>{order.merchantId}</Text>
          </View>
          <View style={[styles.timeBadge, isExpired && styles.timeBadgeExpired]}>
            <Text style={styles.timeIcon}>⏱</Text>
            <Text style={[styles.timeText, isExpired && styles.timeTextExpired]}>
              {formatTimeRemaining(order.expiresAt)}
            </Text>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.requirementsBox}>
          <Text style={styles.requirementsLabel}>Required:</Text>
          <View style={styles.requirementsContent}>
            <Text style={styles.requirementsEmoji}>{requirementsEmoji}</Text>
            <Text style={styles.requirementsText} numberOfLines={2}>{requirementsText}</Text>
          </View>
        </View>

        {/* Rewards - compact */}
        <View style={styles.rewardBox}>
          <View style={styles.rewardCompact}>
            <CoinIcon size={20} />
            <Text style={styles.rewardMainText}>{order.totalReward}</Text>
            <Text style={styles.rewardBonusText}>(+{order.bonusPercentage}%)</Text>
          </View>
        </View>

        {/* Action button */}
        <TouchableOpacity
          style={[
            styles.fulfillButton, 
            !canFulfill && styles.fulfillButtonDisabled
          ]}
          onPress={() => handleFulfillOrder(order.id)}
          disabled={!canFulfill}
          activeOpacity={0.8}
        >
          <Text style={styles.fulfillButtonText}>
            {isExpired ? '⏰ Expired' : canFulfill ? '✓ Fulfill' : '🔒 Missing Items'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <OrderBoxIcon size={28} />
              <Text style={styles.headerTitle}>Orders</Text>
            </View>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            {orders.length === 0 ? (
              <View style={styles.emptyState}>
                <OrderBoxIcon size={80} />
                <Text style={styles.emptyStateTitle}>No Active Orders</Text>
                <Text style={styles.emptyStateText}>
                  New orders arrive at the top of every hour.{'\n'}
                  Check back soon!
                </Text>
              </View>
            ) : (
              <View style={styles.ordersGrid}>
                {orders.map(renderOrder)}
              </View>
            )}

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>ℹ️ How Orders Work</Text>
              <Text style={styles.infoText}>
                • New orders arrive every hour (if you have available slots)
              </Text>
              <Text style={styles.infoText}>
                • You can have up to 3 active orders at once
              </Text>
              <Text style={styles.infoText}>
                • Orders expire after 24 hours
              </Text>
              <Text style={styles.infoText}>
                • Build merchant affinity to earn 10-50% bonus coins
              </Text>
              <Text style={styles.infoText}>
                • Nectar orders require bottled nectar (buy bottles in the shop)
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 600,
    height: '80%',
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FDE68A',
    borderBottomWidth: 2,
    borderBottomColor: '#92400E',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#92400E',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  ordersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#78350f',
    textAlign: 'center',
    lineHeight: 24,
  },
  orderCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FDE68A',
    padding: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardExpired: {
    opacity: 0.5,
    borderColor: '#D1D5DB',
  },
  orderHeader: {
    gap: 6,
  },
  merchantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  merchantIcon: {
    fontSize: 14,
  },
  merchantName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  timeBadgeExpired: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  timeIcon: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  timeTextExpired: {
    color: '#DC2626',
  },
  requirementsBox: {
    backgroundColor: '#FEF9C3',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  requirementsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  requirementsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requirementsEmoji: {
    fontSize: 24,
  },
  requirementsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350f',
    flex: 1,
  },
  rewardBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  rewardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rewardMainText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
  },
  rewardBonusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22C55E',
  },
  fulfillButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#15803D',
  },
  fulfillButtonDisabled: {
    backgroundColor: '#9CA3AF',
    borderColor: '#6B7280',
  },
  fulfillButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  infoCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
});
