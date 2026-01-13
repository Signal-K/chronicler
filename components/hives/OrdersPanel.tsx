import React, { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HONEY_TYPE_CONFIG, HoneyOrder, HoneyType } from '../../types/honeyOrders';
import type { BottledHoney } from '../../types/inventory';

interface OrderCardProps {
  order: HoneyOrder;
  userHoneyStock: BottledHoney[];
  glassBottles: number;
  onFulfill: (orderId: string) => void;
  isReduced: boolean;
}

function OrderCard({ order, userHoneyStock, glassBottles, onFulfill, isReduced }: OrderCardProps) {
  const [pulseAnim] = useState(new Animated.Value(1));
  const config = HONEY_TYPE_CONFIG[order.honeyType];
  
  // Check if user can fulfill this order
  const matchingHoney = userHoneyStock.filter(h => h.type === order.honeyType);
  const totalMatchingAmount = matchingHoney.reduce((sum, h) => sum + h.amount, 0);
  const canFulfill = totalMatchingAmount >= order.bottlesRequested && glassBottles >= order.bottlesRequested;

  // Pulse animation for fulfillable orders
  useEffect(() => {
    if (canFulfill && !order.isCompleted) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [canFulfill, order.isCompleted, pulseAnim]);

  const displayReward = isReduced 
    ? Math.floor(order.coinReward * 0.5)
    : order.coinReward;
  const displayXP = isReduced
    ? Math.floor(order.xpReward * 0.5)
    : order.xpReward;

  return (
    <Animated.View 
      style={[
        styles.orderCard,
        order.isCompleted && styles.orderCardCompleted,
        canFulfill && !order.isCompleted && styles.orderCardReady,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      {/* Character Header */}
      <View style={styles.characterHeader}>
        <Text style={styles.characterEmoji}>{order.characterEmoji}</Text>
        <View style={styles.characterInfo}>
          <Text style={styles.characterName}>{order.characterName}</Text>
          <Text style={styles.characterMessage}>&ldquo;{order.characterMessage}&rdquo;</Text>
        </View>
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        <View style={styles.honeyTypeRow}>
          <View style={[styles.honeyBadge, { backgroundColor: config.color }]}>
            <Text style={styles.honeyEmoji}>{config.emoji}</Text>
            <Text style={styles.honeyTypeName}>{config.name}</Text>
          </View>
          <Text style={styles.bottleCount}>×{order.bottlesRequested}</Text>
        </View>

        {/* Rewards */}
        <View style={styles.rewardsRow}>
          <View style={styles.reward}>
            <Text style={styles.rewardIcon}>🪙</Text>
            <Text style={[styles.rewardAmount, isReduced && styles.reducedReward]}>
              {displayReward}
            </Text>
            {isReduced && <Text style={styles.reducedLabel}>-50%</Text>}
          </View>
          <View style={styles.reward}>
            <Text style={styles.rewardIcon}>⭐</Text>
            <Text style={[styles.rewardAmount, isReduced && styles.reducedReward]}>
              +{displayXP} XP
            </Text>
          </View>
        </View>

        {/* Status/Action */}
        {order.isCompleted ? (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.fulfillButton,
              !canFulfill && styles.fulfillButtonDisabled,
            ]}
            onPress={() => onFulfill(order.id)}
            disabled={!canFulfill}
          >
            <Text style={[
              styles.fulfillButtonText,
              !canFulfill && styles.fulfillButtonTextDisabled,
            ]}>
              {canFulfill ? '🍯 Fulfill Order' : `Need ${order.bottlesRequested} ${config.name}`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Stock Info */}
        {!order.isCompleted && (
          <Text style={styles.stockInfo}>
            In stock: {totalMatchingAmount} {config.name} • {glassBottles} bottles
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

interface OrdersPanelProps {
  orders: HoneyOrder[];
  userHoneyStock: BottledHoney[];
  glassBottles: number;
  onFulfillOrder: (orderId: string) => void;
  getQuotaStatus: () => Record<HoneyType, { fulfilled: number; quota: number; isReduced: boolean }>;
  onRefreshOrders?: () => void;
}

export function OrdersPanel({
  orders,
  userHoneyStock,
  glassBottles,
  onFulfillOrder,
  getQuotaStatus,
  onRefreshOrders,
}: OrdersPanelProps) {
  const quotaStatus = getQuotaStatus();
  const activeOrders = orders.filter(o => !o.isCompleted);
  const completedOrders = orders.filter(o => o.isCompleted);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>📋</Text>
          <View>
            <Text style={styles.headerTitle}>Daily Orders</Text>
            <Text style={styles.headerSubtitle}>
              {activeOrders.length} pending • {completedOrders.length} completed
            </Text>
          </View>
        </View>
        {onRefreshOrders && (
          <TouchableOpacity style={styles.refreshButton} onPress={onRefreshOrders}>
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quota Info */}
      <View style={styles.quotaContainer}>
        <Text style={styles.quotaTitle}>Daily Quota Status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(Object.entries(quotaStatus) as [HoneyType, { fulfilled: number; quota: number; isReduced: boolean }][]).map(([type, status]) => {
            const config = HONEY_TYPE_CONFIG[type];
            return (
              <View 
                key={type} 
                style={[
                  styles.quotaBadge,
                  status.isReduced && styles.quotaBadgeReduced,
                ]}
              >
                <Text style={styles.quotaEmoji}>{config.emoji}</Text>
                <Text style={styles.quotaText}>
                  {status.fulfilled}/{status.quota}
                </Text>
                {status.isReduced && (
                  <Text style={styles.quotaReducedText}>-50%</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No orders yet today!</Text>
            <Text style={styles.emptySubtext}>
              Check back soon for new honey requests.
            </Text>
          </View>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              userHoneyStock={userHoneyStock}
              glassBottles={glassBottles}
              onFulfill={onFulfillOrder}
              isReduced={quotaStatus[order.honeyType]?.isReduced && !order.isCompleted}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    margin: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#78716C',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#FCD34D',
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 18,
  },
  quotaContainer: {
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  quotaTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  quotaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  quotaBadgeReduced: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
  },
  quotaEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  quotaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  quotaReducedText: {
    fontSize: 10,
    color: '#DC2626',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  ordersList: {
    flex: 1,
    padding: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderCardCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    opacity: 0.8,
  },
  orderCardReady: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  characterEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  characterMessage: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  orderDetails: {
    marginTop: 8,
  },
  honeyTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  honeyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  honeyEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  honeyTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  bottleCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400E',
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reducedReward: {
    color: '#DC2626',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  reducedLabel: {
    fontSize: 10,
    color: '#DC2626',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  fulfillButton: {
    backgroundColor: '#FCD34D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  fulfillButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  fulfillButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  fulfillButtonTextDisabled: {
    color: '#9CA3AF',
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  completedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
  },
  stockInfo: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
